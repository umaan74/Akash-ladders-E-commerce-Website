async function inspect() {
  const res = await fetch('https://akash-ladders-backend.onrender.com/api/products');
  const data = await res.json();
  const mobileProduct = data.products.find(p => p.id === 'prod-1788270528528' || p.name === 'Checking on Mobile');
  if (!mobileProduct) {
    console.log('Product not found!');
    return;
  }
  const { images, ...rest } = mobileProduct;
  console.log('Mobile Product Metadata from Render MongoDB Atlas:');
  console.log(rest);
  console.log('Image count:', images?.length);
  console.log('Image type / length of first image:', images?.[0]?.substring(0, 50), '... total length:', images?.[0]?.length);
}

inspect();
