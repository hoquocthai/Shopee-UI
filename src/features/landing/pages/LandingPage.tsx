import productApi from 'api/productApi';
import slider1 from 'assets/images/banner_slider1.png';
import banner1 from 'assets/images/header_banner1.png';
import banner2 from 'assets/images/header_banner2.png';
import { ProductCard } from 'components/Common';
import { ProductInfo } from 'models/product/productInfo';
import React, { useCallback, useEffect, useState } from 'react';
import Banner from '../components/Banner';
import CategoryContainer from '../components/CategoryContainer';

interface LandingPageProps {}

const LandingPage: React.FunctionComponent<LandingPageProps> = (props) => {
  const [productInfo, setProductInfo] = useState<ProductInfo[] | null>(null);

  const getProduct = useCallback(async () => {
    const res = await productApi.getAllProduct();
    if (res) setProductInfo(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="container">
      <div className="landing-content">
        <Banner slider1={slider1} banner1={banner1} banner2={banner2} />
        <CategoryContainer />
        <div className="landing-content__header">
          <span>DAILY DISCOVER</span>
        </div>

        <div className="landing__list-items">
          {productInfo && productInfo.map((e, i) => <ProductCard key={i} info={e} />)}
        </div>

        {/* {productInfo && (
          <div className="landing__button-container">
            <Button className="landing__button">See More</Button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default LandingPage;
