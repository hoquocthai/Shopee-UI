import { UserOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import authApi from 'api/authApi';
import merchantApi from 'api/merchantApi';
import userApi from 'api/userApi';
import walletApi from 'api/walletApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import appQrcode from 'assets/images/shopee_qrcode.png';
import { DownIcon, HelpIcon, NotificationIcon, TranslateIcon } from 'components/Icons';
import { CoinIcon } from 'components/Icons/CoinIcon';
import { authActions, selectIsLoggedIn, selectIsMerchant } from 'features/auth/authSlice';
import { UserInformation } from 'models/user/userInformation';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface HeaderTopNavProps {}

const HeaderTopNav: React.FunctionComponent<HeaderTopNavProps> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [balance, setBalance] = useState(0);
  const [userDetail, setUserDetail] = useState<UserInformation>();
  const [isMerchant, setIsMerchant] = useState<boolean>(false);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isMerchantState = useAppSelector(selectIsMerchant);
  const { t } = useTranslation();

  const getUserDetail = useCallback(async () => {
    const res = await userApi.getUserDetail(localStorage.getItem('token') || '').catch(() => {
      dispatch(authActions.setIsLoggedIn(false));
      localStorage.removeItem('token');
    });

    if (res) {
      setUserDetail(res);
      dispatch(authActions.setIsLoggedIn(true));
    }
  }, []);

  useEffect(() => {
    getUserDetail();
    checkIsMerchant();
  }, []);

  useEffect(() => {
    if (isMerchantState) checkIsMerchant();
  }, [isMerchantState]);

  useEffect(() => {
    if (isLoggedIn) checkIsMerchant();
  }, [isLoggedIn]);

  const getBalance = useCallback(async () => {
    const token = localStorage.getItem('token') || '';
    const res = await walletApi.getWallet(token).catch(() => setBalance(0));
    if (res) {
      setBalance(res.balance);
    }
  }, [localStorage.getItem('token')]);

  const handlePopover = (value: boolean) => {
    getBalance();
    getUserDetail();
    checkIsMerchant();
  };

  const checkIsMerchant = useCallback(async () => {
    const token = localStorage.getItem('token') || '';
    const res = await merchantApi.checkIsMerchant(token);
    if (res) {
      setIsMerchant(res);
    } else setIsMerchant(res);
  }, []);

  const logout = useCallback(async () => {
    const res = await authApi.logout(localStorage.getItem('token') || '').catch(() => {
      localStorage.removeItem('token');
      navigate('/');
    });

    if (res === 'success') {
      dispatch(authActions.setIsLoggedIn(false));
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      localStorage.removeItem('token');
      navigate('/');
    }
  }, []);

  const content = (
    <div className="landing-header__option-container">
      <div className="auth-option">
        {t('landing.header.right_side.balance')}
        <span>
          <CoinIcon /> {balance}
        </span>
      </div>
      {isMerchant ? (
        <div className="auth-option">
          <span>{t('landing.header.right_side.merchant')}: </span>
          <span style={{ color: '#00F295' }}>{t('landing.header.right_side.registered')}</span>
        </div>
      ) : (
        <div className="auth-option" onClick={() => handleNav('/merchant')}>
          <span>{t('landing.header.right_side.merchant')}: </span>
          <span style={{ color: '#ccc' }}>{t('landing.header.right_side.unregistered')}</span>
        </div>
      )}

      <div className="auth-option" onClick={() => handleNav('/recharge')}>
        {t('landing.header.right_side.recharge')}
      </div>

      {isMerchant && (
        <div className="auth-option" onClick={() => handleNav('/products')}>
          {t('landing.header.right_side.products')}
        </div>
      )}

      <div className="auth-option" onClick={() => handleNav('/transaction-history')}>
        {t('landing.header.right_side.tran_his')}
      </div>

      <div className="auth-option" onClick={() => handleNav('/user-detail')}>
        {t('landing.header.right_side.acc_detail')}
      </div>

      <div className="auth-option" onClick={logout}>
        {t('landing.header.right_side.logout')}
      </div>
    </div>
  );

  const downloadContent = (
    <div className="shopee-qrcode">
      <img src={appQrcode} alt="app-qrcode" />
    </div>
  );

  const handleNav = (val: string) => {
    navigate(val);
  };

  return (
    <div className="header-top__navbar">
      <div className="container">
        <div className="header-top__group">
          <span className="header-top__nav">{t('landing.header.left_side.tag1')}</span>
          <div className="header-top__divider" />
          {!isLoggedIn && (
            <>
              <span className="header-top__nav">{t('landing.header.left_side.tag2')}</span>
              <div className="header-top__divider" />
            </>
          )}
          <Popover content={downloadContent} placement="bottomLeft">
            <span className="header-top__nav">{t('landing.header.left_side.tag3')}</span>
          </Popover>
          <div className="header-top__divider" />
          <span className="header-top__nav">{t('landing.header.left_side.tag4')}</span>
        </div>

        <div className="header-top__group">
          <span className="header-top__nav">
            <NotificationIcon style={{ width: '14px', height: '18px' }} />
            {t('landing.header.right_side.tag1')}
          </span>
          <span className="header-top__nav">
            <HelpIcon style={{ width: '18px', height: '18px' }} />
            {t('landing.header.right_side.tag2')}
          </span>
          <span className="header-top__nav">
            <TranslateIcon style={{ width: '16px', height: '16px' }} />
            {t('landing.header.right_side.tag3')}
            <DownIcon />
          </span>
          {!isLoggedIn ? (
            <>
              <span className="header-top__nav" onClick={() => navigate('/register')}>
                {t('landing.header.right_side.tag5')}
              </span>
              <div className="header-top__divider" />
              <span className="header-top__nav" onClick={() => navigate('/login')}>
                {t('landing.header.right_side.tag6')}
              </span>
            </>
          ) : (
            <Popover
              style={{ width: '600px' }}
              onVisibleChange={handlePopover}
              placement="bottomRight"
              title={<span>{userDetail?.email}</span>}
              content={content}
              // trigger="click"

              className="header-top-avatar__container"
            >
              <div className="header-top-avatar__logo">
                <UserOutlined />
              </div>
              <span className="header-top-avatar__name">{userDetail?.email.split('@')[0]}</span>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderTopNav;
