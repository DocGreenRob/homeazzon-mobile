import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'index',
		pathMatch: 'full'
	},
	{
		path: 'attachments',
		loadChildren: () => import('./pages/features/attachments/attachments/attachments.module').then(m => m.AttachmentsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'item-details',
		loadChildren: () => import('./pages/features/items/item-details/item-details.module').then(m => m.ItemDetailsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'profile-items',
		loadChildren: () => import('./pages/features/items/profile-items/profile-items.module').then(m => m.ProfileItemsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'items',
		loadChildren: () => import('./pages/features/items/items/items.module').then(m => m.ItemsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'item-add',
		loadChildren: () => import('./pages/features/items/item-add/item-add.module').then(m => m.ItemAddPageModule)
	},
	{
		path: 'item-edit',
		loadChildren: () => import('./pages/features/items/item-edit/item-edit.module').then(m => m.ItemEditPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-general-information',
		loadChildren: () => import('./pages/features/property-profile/property-profile-general-information/property-profile-general-information.module').then(m => m.PropertyProfileGeneralInformationPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-bedrooms',
		loadChildren: () => import('./pages/features/property-profile/property-profile-bedrooms/property-profile-bedrooms.module').then(m => m.PropertyProfileBedroomsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-bathrooms',
		loadChildren: () => import('./pages/features/property-profile/property-profile-bathrooms/property-profile-bathrooms.module').then(m => m.PropertyProfileBathroomsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-interior-areas',
		loadChildren: () => import('./pages/features/property-profile/property-profile-interior-areas/property-profile-interior-areas.module').then(m => m.PropertyProfileInteriorAreasPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-exterior-areas',
		loadChildren: () => import('./pages/features/property-profile/property-profile-exterior-areas/property-profile-exterior-areas.module').then(m => m.PropertyProfileExteriorAreasPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'edit-profile',
		loadChildren: () => import('./pages/features/property-profile/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'search',
		loadChildren: () => import('./pages/features/search/search/search.module').then(m => m.SearchPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'search-results',
		loadChildren: () => import('./pages/features/search/search-results/search-results.module').then(m => m.SearchResultsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'search-result-details',
		loadChildren: () => import('./pages/features/search/search-result-details/search-result-details.module').then(m => m.SearchResultDetailsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profiles',
		loadChildren: () => import('./pages/features/private-label/property-profiles/property-profiles.module').then(m => m.PropertyProfilesPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-details',
		loadChildren: () => import('./pages/features/private-label/property-profile-details/property-profile-details.module').then(m => m.PropertyProfileDetailsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-interactive-models',
		loadChildren: () => import('./pages/features/private-label/property-profile-interactive-models/property-profile-interactive-models.module').then(m => m.PropertyProfileInteractiveModelsPageModule),
		canActivate: [AuthGuardService]
	},

	{
		path: 'choose-lot',
		loadChildren: () => import('./pages/features/private-label/choose-lot/choose-lot.module').then(m => m.ChooseLotPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'choose-development',
		loadChildren: () => import('./pages/features/private-label/choose-development/choose-development.module').then(m => m.ChooseDevelopmentPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'lot-details',
		loadChildren: () => import('./pages/features/private-label/lot-details/lot-details.module').then(m => m.LotDetailsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'congratulations',
		loadChildren: () => import('./pages/features/private-label/congratulations/congratulations.module').then(m => m.CongratulationsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'help',
		loadChildren: () => import('./pages/features/account/help/help.module').then(m => m.HelpPageModule),

	},
	{
		path: 'sign-in',
		loadChildren: () => import('./pages/features/account/sign-in/sign-in.module').then(m => m.SignInPageModule)
	},
	{
		path: 'add-room-modal',
		loadChildren: () => import('./pages/modals/add-room-modal/add-room-modal.module').then(m => m.AddRoomModalPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'interactive-model-modal',
		loadChildren: () => import('./pages/modals/interactive-model-modal/interactive-model-modal.module').then(m => m.InteractiveModelModalPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'design-plans',
		loadChildren: () => import('./pages/features/private-label/design-plans/design-plans.module').then(m => m.DesignPlansPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-images',
		loadChildren: () => import('./pages/features/private-label/property-profile-images/property-profile-images.module').then(m => m.PropertyProfileImagesPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-overview',
		loadChildren: () => import('./pages/features/private-label/property-profile-overview/property-profile-overview.module').then(m => m.PropertyProfileOverviewPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'single-design-plan',
		loadChildren: () => import('./pages/features/private-label/single-design-plan/single-design-plan.module').then(m => m.SingleDesignPlanPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'share-mail-partner',
		loadChildren: () => import('./pages/features/private-label/share-mail-partner/share-mail-partner.module').then(m => m.ShareMailPartnerPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'create-metattach',
		loadChildren: () => import('./pages/features/attachments/create-metattach/create-metattach.module').then(m => m.CreateMetattachPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'welcome',
		loadChildren: () => import('./pages/features/app-start/welcome/welcome.module').then(m => m.WelcomePageModule)
	},
	{
		path: 'intro',
		loadChildren: () => import('./pages/features/app-start/intro/intro.module').then(m => m.IntroPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'share-with-partner',
		loadChildren: () => import('./pages/features/private-label/share-with-partner/share-with-partner.module').then(m => m.ShareWithPartnerPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'property-profile-address',
		loadChildren: () => import('./pages/features/property-profile/property-profile-address/property-profile-address.module').then(m => m.PropertyProfileAddressPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'choose-home',
		loadChildren: () => import('./pages/features/private-label/choose-home/choose-home.module').then(m => m.ChooseHomePageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'line-items',
		loadChildren: () => import('./pages/features/items/line-items/line-items.module').then(m => m.LineItemsPageModule),
		canActivate: [AuthGuardService]
	},
	{
		path: 'index',
		loadChildren: () => import('./pages/features/app-start/index/index.module').then(m => m.IndexPageModule)
	},
	{
		path: 'list-modal',
		loadChildren: () => import('./pages/modals/list-modal/list-modal.module').then(m => m.ListModalPageModule)
	},
	{
		path: 'edit-categories',
		loadChildren: () => import('./pages/modals/edit-categories/edit-categories.module').then(m => m.EditCategoriesPageModule)
	},
	{
		path: 'interstatial',
		loadChildren: () => import('./pages/features/account/interstatial/interstatial.module').then(m => m.InterstatialPageModule)
	},
	{
		path: 'callback',
		loadChildren: () => import('./pages/features/account/callback/callback.module').then(m => m.CallbackPageModule)
	},
	{
		path: 'add-line-item',
		loadChildren: () => import('./pages/features/items/add-line-item/add-line-item.module').then(m => m.AddLineItemPageModule)
	},
	{
		path: 'sign-up',
		loadChildren: () => import('./pages/features/account/sign-up/sign-up.module').then(m => m.SignUpPageModule)
	},
	{
		path: 'contact-information-modal',
		loadChildren: () => import('./pages/modals/contact-information-modal/contact-information-modal.module').then(m => m.ContactInformationModalPageModule)
	},
	{
		path: 'item-move-clone',
		loadChildren: () => import('./pages/features/items/item-move-clone/item-move-clone.module').then(m => m.ItemMoveClonePageModule)
	},
	{
		path: 'user-types-manager',
		loadChildren: () => import('./pages/features/user-types/user-types-manager/user-types-manager.module').then(m => m.UserTypesManagerPageModule)
	},
	{
		path: 'user-types-owner',
		loadChildren: () => import('./pages/features/user-types/user-types-owner/user-types-owner.module').then(m => m.UserTypesOwnerPageModule)
	},
	{
		path: 'user-types-realtor',
		loadChildren: () => import('./pages/features/user-types/user-types-realtor/user-types-realtor.module').then(m => m.UserTypesRealtorPageModule)
	},
	{
		path: 'user-types-renter',
		loadChildren: () => import('./pages/features/user-types/user-types-renter/user-types-renter.module').then(m => m.UserTypesRenterPageModule)
	},
	{
		path: 'user-types-tradesman',
		loadChildren: () => import('./pages/features/user-types/user-types-tradesman/user-types-tradesman.module').then(m => m.UserTypesTradesmanPageModule)
	},
	{
		path: 'user-types-developer',
		loadChildren: () => import('./pages/features/user-types/user-types-developer/user-types-developer.module').then(m => m.UserTypesDeveloperPageModule)
	},
	{
		path: 'user-types-vendor',
		loadChildren: () => import('./pages/features/user-types/user-types-vendor/user-types-vendor.module').then(m => m.UserTypesVendorPageModule)
	},
	{
		path: 'user-types-selector',
		loadChildren: () => import('./pages/features/user-types/user-types-selector/user-types-selector.module').then(m => m.UserTypesSelectorPageModule)
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
