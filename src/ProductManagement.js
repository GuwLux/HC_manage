import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageFile: null,
    type: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 當組件掛載時，獲取所有商品列表
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://hcbackend.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProduct((prevProduct) => ({ ...prevProduct, imageFile: file }));
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('imageFile', newProduct.imageFile);
      formData.append('type', newProduct.type);
      formData.append('description', newProduct.description);

      // 發送包含檔案的新增商品請求
      await axios.post('https://hcbackend.onrender.com/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 重新獲取商品列表
      fetchProducts();
      // 清空表單
      setNewProduct({
        name: '',
        price: '',
        imageFile: null,
        type: '',
        description: '',
      });
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      // 發送刪除商品的請求
      await axios.delete(`https://hcbackend.onrender.com/api/products/${productId}`);
      // 重新獲取商品列表
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>商品管理</h2>

      {/* 新增商品表單 */}
      <div>
        <h3>新增商品</h3>
        <div>
          <label>名稱:</label>
          <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
        </div>
        <div>
          <label>價格:</label>
          <input type="text" name="price" value={newProduct.price} onChange={handleInputChange} />
        </div>
        <div>
          <label>車種:</label>
          <input type="text" name="type" value={newProduct.type} onChange={handleInputChange} />
        </div>
        <div>
          <label>簡介:</label>
          <textarea name="description" value={newProduct.description} onChange={handleInputChange} />
        </div>
        <div>
          <label>圖片檔案:</label>
          <input type="file" name="imageFile" onChange={handleFileChange} />
        </div>
        <div>
          <button onClick={handleAddProduct} disabled={loading}>
            {loading ? '新增中...' : '新增商品'}
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div>
        <h3>商品列表</h3>
        {loading && <div>載入中...</div>}
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.name}
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
              {product.name} - ${product.price}
              <br />
              車種: {product.type}
              <br />
              簡介: {product.description}
              <button onClick={() => handleDeleteProduct(product._id)} disabled={loading}>
                {loading ? '刪除中...' : '刪除'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;