import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Home,
  HomeItems,
  HomeSales,
  Customers,
  Item,
  Items,
  Inventory,
  Suppliers,
  Sales,
  Purchases,
  ItemGroup,
  Settings,
  Tables,
  Groups,
  TranPOPrint,
  TranSalesPrint,
  TransAdjust,
  TransAdjustForm,
  TransAdjustPrint,
  Users,
  Auditlog,
  Error,
  PurchasesInvoice,
  SalesInvoice,
} from '../pages';

const RoutesMain = () => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <React.Suspense fallback={<>...</>}>
            <Home />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/homeitems"
        element={
          <React.Suspense fallback={<>...</>}>
            <HomeItems />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/homesales"
        element={
          <React.Suspense fallback={<>...</>}>
            <HomeSales />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/item"
        element={
          <React.Suspense fallback={<>...</>}>
            <Item />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/items"
        element={
          <React.Suspense fallback={<>...</>}>
            <Items />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/customers"
        element={
          <React.Suspense fallback={<>...</>}>
            <Customers />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/suppliers"
        element={
          <React.Suspense fallback={<>...</>}>
            <Suppliers />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/purchases"
        element={
          <React.Suspense fallback={<>...</>}>
            <Purchases />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/purchaseinvoice"
        element={
          <React.Suspense fallback={<>...</>}>
            <PurchasesInvoice />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/sales"
        element={
          <React.Suspense fallback={<>...</>}>
            <Sales />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/salesinvoice"
        element={
          <React.Suspense fallback={<>...</>}>
            <SalesInvoice />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/tranpoprint"
        element={
          <React.Suspense fallback={<>...</>}>
            <TranPOPrint />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/transalesprint"
        element={
          <React.Suspense fallback={<>...</>}>
            <TranSalesPrint />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/adjustment"
        element={
          <React.Suspense fallback={<>...</>}>
            <TransAdjust />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/adjustmentform"
        element={
          <React.Suspense fallback={<>...</>}>
            <TransAdjustForm />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/adjustmentprint"
        element={
          <React.Suspense fallback={<>...</>}>
            <TransAdjustPrint />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/inventory"
        element={
          <React.Suspense fallback={<>...</>}>
            <Inventory />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/itemgroups"
        element={
          <React.Suspense fallback={<>...</>}>
            <ItemGroup />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/settings"
        element={
          <React.Suspense fallback={<>...</>}>
            <Settings />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/auditlog"
        element={
          <React.Suspense fallback={<>...</>}>
            <Auditlog />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/groups"
        element={
          <React.Suspense fallback={<>...</>}>
            <Groups />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/users"
        element={
          <React.Suspense fallback={<>...</>}>
            <Users />
          </React.Suspense>
        }
      />
      <Route
        exact
        path="/tables"
        element={
          <React.Suspense fallback={<>...</>}>
            <Tables />
          </React.Suspense>
        }
      />

      <Route
        exact
        path="/error"
        element={
          <React.Suspense fallback={<>...</>}>
            <Error />
          </React.Suspense>
        }
      />
      <Route
        path="*"
        element={
          <React.Suspense fallback={<>...</>}>
            <Error />
          </React.Suspense>
        }
      />
    </Routes>
  );
};

export default RoutesMain;
