import {
    SafButton, SafIcon, SafBadge, SafText, SafTextfield, SafTextarea, SafEmptyState,
    SafSwitch, SafSplitter, SafCard, SafAnchor, SafFooter, SafList, SafListItem,
    SafLogo, SafProductHeader, SafMenu, SafMenuItem, SafDivider,
    SafProgress, SafProgressRing, SafAlert, SafTabs, SafTab, SafSideNav, SafProductHeaderItem,
    SafDrawer, SafToolbar, SafCheckbox, SafListbox, SafCombobox, SafSelect, SafListboxOption,
    SafDialog, SafPagination, SafAvatar, SafBreadcrumb, SafBreadcrumbItem, SafFacetedFilter,
    SafFacetCategory, SafFacetItem, SafSrOnly, SafRadio, SafRadioGroup, SafTreeView, SafTreeItem,
    SafSearchField, SafButtonGroup, SafNumberField, SafStepper, SafStep, SafAccordion, SafAccordionItem
} from "@saffron/core-components";
import WebViewer from '@pdftron/webviewer';
import './styles.scss';

window.initializeWebViewer = () => {
    WebViewer({
        path: '/webviewer',
        licenseKey: 'Thomson Reuters Holdings Inc. (thomsonreuters.com):OEM:Onvio Firm Management, Onvio Documents, Onvio Client Center, GoFileRoom, AdvanceFlow, Practical Law::B+:AMS(20240426):F6A518CD0457480A0360B13AC982537860615F3EB766E50395B51BD45CD5009E1A8A31F5C7',
      }, document.getElementById('viewer'))
        .then(instance => {
          const { UI, Core } = instance;
          const { documentViewer, annotationManager, Tools, Annotations } = Core;
          // call methods from UI, Core, documentViewer and annotationManager as needed
      
          documentViewer.addEventListener('documentLoaded', () => {
            // call methods relating to the loaded document
          });
      
          instance.UI.loadDocument('https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf');
        });
}

SafButton();
SafIcon();
SafBadge();
SafTextarea();
SafEmptyState();
SafSwitch();
SafSplitter();
SafCard();
SafText();
SafTextfield();
SafAnchor();
SafFooter();
SafList();
SafListItem();
SafLogo();
SafProductHeader();
SafMenu();
SafMenuItem();
SafDivider();
SafProgress();
SafProgressRing();
SafAlert();
SafTabs();
SafTab();
SafSideNav();
SafProductHeaderItem();
SafDrawer();
SafToolbar();
SafCheckbox();
SafListbox();
SafCombobox();
SafSelect();
SafListboxOption();
SafDialog();
SafPagination();
SafAvatar();
SafBreadcrumb();
SafBreadcrumbItem();
SafFacetedFilter();
SafFacetCategory();
SafFacetItem();
SafSrOnly();
SafRadio();
SafRadioGroup();
SafTreeView();
SafTreeItem();
SafSearchField();
SafButtonGroup();
SafNumberField();
SafStepper();
SafStep();
SafAccordion();
SafAccordionItem();