import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import jwt_decode from 'jwt-decode'
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, resetUser } from './redux/slides/userSilde'
import axios from 'axios'
import Loading from './components/LoadingComponent/Loading'


function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);

      try {
        const { storageData, decoded } = handleDecoded();
        if (decoded?.id) {
          await handleGetDetailsUser(decoded.id, storageData);
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);



  const handleDecoded = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwt_decode(storageData)
    }
    return { decoded, storageData }
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwt_decode(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Beare ${data?.access_token}`
      } else {
        dispatch(resetUser)
      }

    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
    setIsLoading(false)
  }

  return (
    <div>
      <Loading isLoading={isLoading} >
        <Router>
          <Routes>
            {routes
              .filter((route) => !route.isPrivate || user.isAdmin)
              .map((route) => {
                const Page = route.page;
                const Layout = route.isShowHeader ? DefaultComponent : Fragment;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                );
              })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App