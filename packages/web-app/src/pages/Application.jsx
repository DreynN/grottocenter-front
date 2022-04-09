import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import Api from '../components/appli/Api';
import Dashboard from './Dashboard';
import Swagger from './Swagger';
import HomePage from './HomePage';
import AdvancedSearchPage from './AdvancedSearchPage';
import DocumentDetailsPage from './DocumentDetails';
import DuplicateImportHandle from './DuplicateImportHandle';
import Faq from '../components/appli/Faq';
import LatestBlogNewsSection from '../components/homepage/LatestBlogNewsSection';
import Layout from '../components/common/Layouts/Main';

import AppBar from '../features/AppBar';
import ChangePassword from '../features/ChangePassword';
import LoginDialog from '../features/Login';
import QuickSearch from '../features/QuickSearch';
import SignUp from '../features/SignUp';
import ForgotPassword from '../features/ForgotPassword';

import { usePermissions } from '../hooks';

import CaveSystemPage from './CaveSystem';
import ContributionsPage from './Contributions';
import DocumentSubmission from './DocumentSubmission';
import DocumentValidation from './DocumentValidation';
import DocumentEdit from './DocumentEdit';
import EntryPage from './Entry';
import ManageUsers from './Admin/ManageUsers';
import Map from './Map';
import MassifPage from './Massif';
import OrganizationPage from './Organization';
import EntityCreation from './EntityCreation';
import ImportContainer from './ImportCSV';

const Application = () => {
  const dispatch = useDispatch();
  const isSideMenuOpen = useSelector(state => state.sideMenu.open);
  const permissions = usePermissions();
  const toggleSideMenu = () => dispatch({ type: 'TOGGLE_SIDEMENU' });

  return (
    <Layout
      AppBar={() => (
        <AppBar
          isSideMenuOpen={isSideMenuOpen}
          toggleSideMenu={toggleSideMenu}
          HeaderQuickSearch={() => <QuickSearch hasFixWidth={false} />}
        />
      )}
      isAuth={permissions.isAuth}
      isSideMenuOpen={isSideMenuOpen}
      toggleSideMenu={toggleSideMenu}
      SideBarQuickSearch={() => <QuickSearch />}>
      <LoginDialog />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/ui" component={Dashboard} />
        <Route path="/ui/admin/users" component={ManageUsers} />
        <Route path="/ui/search" component={AdvancedSearchPage} />
        <Route path="/ui/api" component={Api} />
        <Route path="/ui/entrances/:id?" component={EntryPage} />
        <Route path="/ui/caves/:id?" component={CaveSystemPage} />
        <Route path="/ui/faq" component={Faq} />
        <Route path="/ui/map/:target?" component={Map} />
        <Route path="/ui/contributions" component={ContributionsPage} />
        <Route path="/ui/swagger/:version" component={Swagger} />
        <Route path="/ui/test" component={LatestBlogNewsSection} />
        <Route
          path="/ui/organizations/:organizationId"
          component={OrganizationPage}
        />
        <Route path="/ui/massifs/:massifId" component={MassifPage} />
        <Route path="/ui/login" component={HomePage} />
        <Route path="/ui/signup" component={SignUp} />
        <Route path="/ui/entity/add" component={EntityCreation} />
        <Route path="/ui/forgotPassword" component={ForgotPassword} />
        <Route path="/ui/changePassword" component={ChangePassword} />
        <Route path="/ui/documents/add" component={DocumentSubmission} />
        <Route path="/ui/documents/validation" component={DocumentValidation} />
        <Route path="/ui/documents/edit/:documentId" component={DocumentEdit} />
        <Route
          path="/ui/documents/:documentId"
          component={DocumentDetailsPage}
        />
        <Route path="/ui/import-csv" component={ImportContainer} />
        <Route path="/ui/duplicates" component={DuplicateImportHandle} />
        <Redirect path="/ui/*" to="/ui" />
      </Switch>
    </Layout>
  );
};

export default Application;
