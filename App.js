import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';

export default function App() {
  const [view, setView] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [installments, setInstallments] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  const [storeConfig, setStoreConfig] = useState({
    name: 'Royal Joias',
    whatsapp: '5511999999999',
    pixDiscount: 0.1,
    maxInstallments: 12
  });

  const [newProduct, setNewProduct] = useState({ sku: '', name: '', price: '' });

  useEffect(() => {
    const savedProducts = localStorage.getItem('luxury_products');
    const savedConfig = localStorage.getItem('luxury_config');
    const savedOrders = localStorage.getItem('luxury_orders');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initial = [{ id: 1, sku: 'RJ-772', name: 'Anel de Diamante 18k', price: 4500 }];
      setProducts(initial);
      localStorage.setItem('luxury_products', JSON.stringify(initial));
    }

    if (savedConfig) setStoreConfig(JSON.parse(savedConfig));
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const updateStoreConfig = (newConfig) => {
    setStoreConfig(newConfig);
    localStorage.setItem('luxury_config', JSON.stringify(newConfig));
  };

  const updateProductsList = (newList) => {
    setProducts(newList);
    localStorage.setItem('luxury_products', JSON.stringify(newList));
  };

  const saveOrder = (orderData) => {
    const newOrders = [orderData, ...orders];
    setOrders(newOrders);
    localStorage.setItem('luxury_orders', JSON.stringify(newOrders));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    updateProductsList([...products, { ...newProduct, id: Date.now(), price: parseFloat(newProduct.price) }]);
    setNewProduct({ sku: '', name: '', price: '' });
  };

  const deleteProduct = (id) => {
    updateProductsList(products.filter(p => p.id !== id));
  };

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const discountAmount = paymentMethod === 'pix' ? subtotal * storeConfig.pixDiscount : 0;
  const total = subtotal - discountAmount;

  const formatCurrency = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const finalizePurchase = () => {
    if (!customerData.name) {
      alert("Por favor, preencha o nome do cliente.");
      return;
    }
    const orderData = {
      id: Date.now(),
      date: new Date().toLocaleString('pt-BR'),
      customer: { ...customerData },
      items: [...cart],
      paymentMethod,
      installments: paymentMethod === 'card' ? installments : 1,
      subtotal,
      discount: discountAmount,
      total
    };
    saveOrder(orderData);
    setActiveOrder(orderData);
    setView('success');
  };

  const sendWhatsApp = (order) => {
    const message = `*PEDIDO CONFIRMADO - ${storeConfig.name}*\n\n` +
      `*Cliente:* ${order.customer.name}\n` +
      `*Data:* ${order.date}\n` +
      `*Itens:* ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}\n` +
      `*Pagamento:* ${order.paymentMethod.toUpperCase()} ${order.installments > 1 ? `(${order.installments}x)` : ''}\n` +
      `*Total:* ${formatCurrency(order.total)}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${encoded}`, '_blank');
  };

  const handleDownloadPdf = (orderToPrint = activeOrder) => {
    if (!orderToPrint) return;
    const element = document.getElementById('receipt-content-print');
    setIsGeneratingPdf(true);

    const opt = {
      margin: 0,
      filename: `Recibo_${orderToPrint.customer.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().from(element).set(opt).save()
        .then(() => setIsGeneratingPdf(false))
        .catch(err => {
          console.error(err);
          setIsGeneratingPdf(false);
        });
    } else {
      alert("Biblioteca de PDF carregando...");
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-serif text-[#2D2926]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#E5DACE] px-6 py-4 flex justify-between items-center shadow-sm">
        <button onClick={() => setView('admin')} className="text-[#A68966] hover:scale-110 transition-transform p-2">
          <Icons.Settings size={20} />
        </button>
        <h1 className="text-lg tracking-[0.4em] uppercase cursor-pointer select-none" onClick={() => setView('catalog')}>
          {storeConfig.name}
        </h1>
        <button onClick={() => setView('cart')} className="relative p-2 hover:scale-110 transition-transform">
          <Icons.ShoppingCart size={20} />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-[#A68966] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-6 pb-32">
        {view === 'admin' && (
          <div className="space-y-8 animate-in fade-in duration-500 font-sans">
            <button onClick={() => setView('catalog')} className="text-[10px] uppercase tracking-widest text-[#A68966] flex items-center gap-1">
              <Icons.ChevronLeft size={14}/> Voltar ao Catálogo
            </button>

            <div className="bg-white border border-[#E5DACE] p-6 rounded-sm shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-l-2 border-[#A68966] pl-3 flex items-center gap-2">
                <Icons.History size={16}/> Histórico de Pedidos
              </h2>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                {orders.length === 0 ? (
                  <p className="text-xs italic text-gray-400">Nenhum pedido realizado ainda.</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="p-3 border border-gray-100 flex justify-between items-center bg-[#FDFBF7] hover:border-[#A68966] transition-colors">
                      <div className="text-[10px]">
                        <p className="font-bold text-sm uppercase">{order.customer.name}</p>
                        <p className="text-gray-400">{order.date} • {formatCurrency(order.total)}</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setActiveOrder(order); setTimeout(() => handleDownloadPdf(order), 100); }} className="p-2 bg-white border border-[#E5DACE] rounded hover:bg-gray-50 text-gray-600">
                           <Icons.Download size={14}/>
                         </button>
                         <button onClick={() => sendWhatsApp(order)} className="p-2 bg-[#25D366] text-white rounded hover:opacity-80">
                           <Icons.MessageCircle size={14}/>
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-[#E5DACE] p-6 rounded-sm shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-l-2 border-[#A68966] pl-3">Dados da Empresa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-gray-400">Nome Comercial</label>
                  <input className="w-full border-b py-2 text-sm outline-none focus:border-[#A68966]" value={storeConfig.name} onChange={e => updateStoreConfig({...storeConfig, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-gray-400">WhatsApp</label>
                  <input className="w-full border-b py-2 text-sm outline-none focus:border-[#A68966]" value={storeConfig.whatsapp} onChange={e => updateStoreConfig({...storeConfig, whatsapp: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5DACE] p-6 rounded-sm shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 border-l-2 border-[#A68966] pl-3">Catálogo de Peças</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 gap-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className="border-b py-2 text-sm outline-none focus:border-[#A68966]" placeholder="Nome da Joia" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input className="border-b py-2 text-sm outline-none focus:border-[#A68966]" placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                  <input className="border-b py-2 text-sm outline-none focus:border-[#A68966]" placeholder="Preço" type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <button className="bg-[#2D2926] text-white py-3 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                  <Icons.PlusCircle size={14}/> Adicionar à Coleção
                </button>
              </form>
              <div className="space-y-2 border-t pt-4">
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-3 border border-gray-50 text-xs">
                    <span><strong className="uppercase">{p.name}</strong> <span className="text-gray-400 ml-1">#{p.sku}</span></span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatCurrency(p.price)}</span>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-300 hover:text-red-600"><Icons.Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'catalog' && (
          <div className="animate-in fade-in duration-700">
            <div className="text-center py-12">
               <span className="text-[10px] uppercase tracking-[0.4em] text-[#A68966]">Curadoria de Luxo</span>
               <h2 className="text-3xl font-light italic mt-2">Nossas Peças</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {products.map(p => (
                <div key={p.id} className="text-center group cursor-pointer" onClick={() => { setCart([{...p, quantity: 1}]); setView('cart'); }}>
                  <div className="h-64 bg-[#F5F2EE] flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-[#E5DACE]">
                    <Icons.Star size={40} strokeWidth={0.5} className="text-[#A68966] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xs uppercase tracking-widest font-bold">{p.name}</h3>
                  <p className="text-sm mt-1 font-sans text-gray-500">{formatCurrency(p.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="animate-in slide-in-from-bottom-4 font-sans max-w-md mx-auto">
            <h2 className="text-xl italic text-center py-8 font-serif">Checkout Exclusivo</h2>
            <div className="space-y-4">
              <input placeholder="Nome Completo" className="w-full border-b py-2 text-sm outline-none focus:border-[#A68966]" value={customerData.name} onChange={e => setCustomerData({...customerData, name: e.target.value})} />
              <input placeholder="WhatsApp de Contato" className="w-full border-b py-2 text-sm outline-none focus:border-[#A68966]" value={customerData.phone} onChange={e => setCustomerData({...customerData, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-2 pt-4">
                <button onClick={() => setPaymentMethod('pix')} className={`p-4 border text-[10px] uppercase flex flex-col items-center gap-2 ${paymentMethod === 'pix' ? 'border-[#A68966] bg-[#FDFBF7]' : 'border-gray-100'}`}>
                  <Icons.QrCode size={18}/> Pix (-{storeConfig.pixDiscount*100}%)
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`p-4 border text-[10px] uppercase flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-[#A68966] bg-[#FDFBF7]' : 'border-gray-100'}`}>
                  <Icons.CreditCard size={18}/> Cartão
                </button>
              </div>
              {paymentMethod === 'card' && (
                <select className="w-full border p-3 text-sm bg-white" value={installments} onChange={e => setInstallments(parseInt(e.target.value))}>
                  {[...Array(storeConfig.maxInstallments)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}x de {formatCurrency(total / (i+1))} (Sem Juros)</option>
                  ))}
                </select>
              )}
              <div className="pt-8 border-t border-[#E5DACE] space-y-1">
                 <div className="flex justify-between text-xs text-gray-400"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                 {discountAmount > 0 && <div className="flex justify-between text-xs text-[#A68966] font-bold"><span>Desconto PIX</span><span>-{formatCurrency(discountAmount)}</span></div>}
                 <div className="flex justify-between text-xl font-bold mt-2 pt-2 border-t border-gray-50 font-serif"><span>Total Final</span><span>{formatCurrency(total)}</span></div>
              </div>
              <button onClick={finalizePurchase} className="w-full bg-[#2D2926] text-white py-4 text-[10px] uppercase tracking-[0.2em] mt-4 shadow-xl">
                Finalizar e Gerar Recibo
              </button>
            </div>
          </div>
        )}

        {view === 'success' && activeOrder && (
          <div className="text-center py-20 space-y-8 animate-in zoom-in-95 duration-500">
            <Icons.CheckCircle2 size={64} className="mx-auto text-[#A68966]" />
            <h2 className="text-3xl font-light italic font-serif">Venda Confirmada</h2>
            <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4 font-sans">
              <button onClick={() => handleDownloadPdf()} disabled={isGeneratingPdf} className="bg-[#2D2926] text-white py-4 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                {isGeneratingPdf ? 'Gerando...' : <><Icons.Download size={16}/> Baixar Certificado A4</>}
              </button>
              <button onClick={() => sendWhatsApp(activeOrder)} className="bg-[#25D366] text-white py-4 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <Icons.MessageCircle size={16}/> WhatsApp
              </button>
              <button onClick={() => setView('catalog')} className="text-[9px] uppercase tracking-widest text-gray-400 mt-6">Voltar</button>
            </div>

            {/* ÁREA DO PDF (IDêntica à original) */}
            <div style={{ position: 'absolute', left: '-5000px', top: 0 }}>
              <div id="receipt-content-print" className="bg-white text-[#2D2926] font-serif" style={{ width: '210mm', height: '297mm', padding: '15mm', boxSizing: 'border-box' }}>
                <div className="border-[0.5mm] border-[#E5DACE] h-full p-12 flex flex-col relative">
                   <div className="flex justify-between items-start border-b-[1px] border-[#2D2926] pb-8 mb-12">
                     <div>
                       <h1 className="text-4xl tracking-[0.5em] uppercase font-light mb-2">{storeConfig.name}</h1>
                       <p className="text-[10px] tracking-[0.4em] uppercase text-[#A68966] font-bold">Certificado de Autenticidade</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[11px] uppercase font-black">REGISTRO Nº {activeOrder.id.toString().slice(-6)}</p>
                       <p className="text-xs italic text-gray-500">{activeOrder.date}</p>
                     </div>
                   </div>
                   <div className="mb-14 grid grid-cols-2 gap-8 bg-[#FDFBF7] p-8 border border-[#F5F2EE]">
                     <div>
                       <p className="text-[9px] uppercase font-black text-[#A68966] mb-2">Comprador</p>
                       <p className="text-xl font-bold uppercase">{activeOrder.customer.name}</p>
                     </div>
                     <div className="text-right border-l pl-8 border-[#E5DACE]">
                       <p className="text-[9px] uppercase font-black text-[#A68966] mb-2">Pagamento</p>
                       <p className="text-sm font-sans uppercase font-bold">{activeOrder.paymentMethod === 'pix' ? 'PIX' : `Cartão (${activeOrder.installments}x)`}</p>
                     </div>
                   </div>
                   <div className="flex-grow">
                     <table className="w-full text-left">
                       <thead className="border-b-[1px] border-gray-200">
                         <tr>
                           <th className="py-3 text-[10px] uppercase text-gray-400">Descrição</th>
                           <th className="py-3 text-[10px] uppercase text-gray-400 text-right">Avaliação</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                         {activeOrder.items.map(item => (
                           <tr key={item.id}>
                             <td className="py-10">
                               <span className="text-2xl font-bold uppercase block">{item.name}</span>
                               <span className="text-[10px] text-[#A68966] uppercase font-bold">SKU: {item.sku || 'EXCLUSIVA'}</span>
                             </td>
                             <td className="py-10 text-right text-2xl font-bold">{formatCurrency(item.price)}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                   <div className="mt-auto pt-12 border-t-[1px] border-[#2D2926] flex justify-between items-end">
                     <div className="max-w-[120mm]">
                       <p className="text-[11px] font-sans italic text-gray-500 leading-relaxed mb-6">
                         A <strong>{storeConfig.name}</strong> certifica a pureza dos materiais e a procedência das gemas.
                       </p>
                       <div className="flex gap-1">
                         {[...Array(5)].map((_,i) => <Icons.Star key={i} size={10} fill="#A68966" stroke="none" />)}
                       </div>
                     </div>
                     <div className="bg-[#2D2926] text-white p-10 min-w-[80mm] text-center shadow-2xl">
                       <p className="text-[9px] uppercase tracking-[0.4em] opacity-50 mb-3">Valor Total</p>
                       <p className="text-4xl font-light">{formatCurrency(activeOrder.total)}</p>
                     </div>
                   </div>
                   <div className="absolute -bottom-20 -right-20 opacity-[0.03] pointer-events-none">
                     <Icons.Star size={400} strokeWidth={0.5} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-[#E5DACE] py-4 text-center z-40">
        <p className="text-[9px] tracking-[0.6em] uppercase text-[#A68966] font-bold">Autenticidade • Excelência • {storeConfig.name}</p>
      </footer>
    </div>
  );
}
