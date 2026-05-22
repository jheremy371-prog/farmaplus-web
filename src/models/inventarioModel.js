import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const productosRef = collection(db, "Productos");
const ventasRef = collection(db, "Ventas");

export const InventarioModel = {
  obtenerProductos: async () => {
    try {
      const data = await getDocs(productosRef);
      return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  },

  registrarVenta: async (carrito, total) => {
    try {
      const nuevaVenta = {
        fecha: new Date(),
        total: total,
        items: carrito.map(item => ({
          id_producto: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        }))
      };
      await addDoc(ventasRef, nuevaVenta);
      return true;
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      return false;
    }
  },

  descontarStock: async (idProducto, nuevaCantidad) => {
    try {
      const productoDoc = doc(db, "Productos", idProducto);
      await updateDoc(productoDoc, { stock: nuevaCantidad });
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    }
  }
};