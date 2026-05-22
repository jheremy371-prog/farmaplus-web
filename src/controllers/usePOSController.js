import { useState, useEffect, useMemo } from 'react';
import { InventarioModel } from '../models/inventarioModel';

// Datos de prueba en caso de que tu Firebase aún esté vacío
const inventarioPrueba = [
  { id: '1', nombre: 'Paracetamol 500mg', precio: 2.50, stock: 50 },
  { id: '2', nombre: 'Amoxicilina 500mg', precio: 5.00, stock: 4 },
];

export const usePOSController = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarInventario = async () => {
      let data = await InventarioModel.obtenerProductos();
      setProductos(data);
      setCargando(false);
    };
    cargarInventario();
  }, []);

  const productosEnAlerta = useMemo(() => productos.filter(p => p.stock <= 5), [productos]);
  
  const productosFiltrados = useMemo(() => {
    return productos.filter(p => p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()));
  }, [productos, terminoBusqueda]);
  
  const totalVenta = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const agregarAlCarrito = (producto) => {
    if (producto.stock === 0) return;

    const itemEnCarrito = carrito.find((item) => item.id === producto.id);
    if (itemEnCarrito) {
      setCarrito(carrito.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    setProductos(productos.map((p) => p.id === producto.id ? { ...p, stock: p.stock - 1 } : p));
  };

  const procesarPago = async () => {
    if (carrito.length === 0) return;
    
    // 1. Guardar la venta en la colección "Ventas"
    const exito = await InventarioModel.registrarVenta(carrito, totalVenta);
    
    if (exito) {
      // 2. ACTUALIZAR EL STOCK EN FIREBASE (NUEVO)
      carrito.forEach(async (item) => {
        // Buscamos el producto original para saber cuánto stock le queda visualmente
        const productoActualizado = productos.find(p => p.id === item.id);
        if(productoActualizado) {
           // Le enviamos a Firebase el nuevo número de stock
           await InventarioModel.descontarStock(item.id, productoActualizado.stock);
        }
      });

      alert(`¡Venta registrada con éxito!\nTotal: S/ ${totalVenta.toFixed(2)}`);
      setCarrito([]); // Vaciamos el carrito
    } else {
      alert("Hubo un error al procesar la venta.");
    }
  };

  return {
    productosFiltrados,
    productosEnAlerta,
    carrito,
    terminoBusqueda,
    setTerminoBusqueda,
    totalVenta,
    cargando,
    agregarAlCarrito,
    procesarPago
  };
};