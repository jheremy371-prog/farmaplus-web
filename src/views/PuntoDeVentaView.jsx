import React from 'react';
import { usePOSController } from '../controllers/usePOSController';

export default function PuntoDeVentaView() {
  const {
    productosFiltrados,
    productosEnAlerta,
    carrito,
    terminoBusqueda,
    setTerminoBusqueda,
    totalVenta,
    cargando,
    agregarAlCarrito,
    procesarPago
  } = usePOSController();

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Cargando sistema...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col font-sans text-slate-800">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">FarmaPlus OS</h1>
          <p className="text-slate-500 font-medium">Terminal de Gestión y Ventas</p>
        </div>
        
        {productosEnAlerta.length > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded">
            <span className="text-rose-700 font-bold">⚠️ {productosEnAlerta.length} Alertas de Stock Bajo</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* PANEL IZQUIERDO: Inventario */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <input
            type="text"
            placeholder="Buscar medicamento..."
            className="w-full p-3 rounded-lg bg-slate-100 mb-6 outline-none focus:ring-2 focus:ring-indigo-500"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productosFiltrados.map((producto) => (
              <button
                key={producto.id}
                onClick={() => agregarAlCarrito(producto)}
                disabled={producto.stock === 0}
                className={`p-4 rounded-xl border text-left transition-all ${
                  producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : producto.stock <= 5 ? 'bg-rose-50 border-rose-200' : 'hover:border-indigo-400'
                }`}
              >
                <div className="font-bold text-slate-800">{producto.nombre}</div>
                <div className="text-xl font-black text-indigo-600 mt-2">S/ {producto.precio.toFixed(2)}</div>
                <div className="text-sm font-bold text-slate-500 mt-1">Stock: {producto.stock}</div>
              </button>
            ))}
            {productosFiltrados.length === 0 && (
               <p className="text-slate-400 col-span-full">No se encontraron productos.</p>
            )}
          </div>
        </div>

        {/* PANEL DERECHO: Caja */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col p-6">
          <h2 className="text-xl font-bold border-b pb-4 mb-4">Venta en Curso</h2>
          
          <div className="flex-1 overflow-y-auto mb-4">
            {carrito.length === 0 ? (
                <p className="text-slate-400 text-center mt-10">Agrega productos a la venta</p>
            ) : (
                carrito.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                    <div>
                    <span className="font-semibold block">{item.nombre}</span>
                    <span className="text-sm text-slate-500">x{item.cantidad}</span>
                    </div>
                    <span className="font-bold">S/ {(item.cantidad * item.precio).toFixed(2)}</span>
                </div>
                ))
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4 text-xl">
              <span className="font-bold">Total:</span>
              <span className="font-black text-indigo-600">S/ {totalVenta.toFixed(2)}</span>
            </div>
            <button 
              onClick={procesarPago}
              disabled={carrito.length === 0}
              className="w-full py-3 bg-emerald-500 text-white rounded-lg font-bold disabled:bg-slate-300"
            >
              Registrar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}