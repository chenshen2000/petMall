import { Navigate } from '@umijs/max';
import React, { useState } from "react";
import {getToken} from '@/models/global'

const withAuth = (Component:React.FC) => () => {
  let token = getToken();
  if (token) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default withAuth