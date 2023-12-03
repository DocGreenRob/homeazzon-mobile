import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular//fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { AddRoomModalPageModule } from './pages/modals/add-room-modal/add-room-modal.module';
import { LotDetailsPageModule } from './pages/features/private-label/lot-details/lot-details.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PropertyProfileInteractiveModelsPageModule } from './pages/features/private-label/property-profile-interactive-models/property-profile-interactive-models.module';
import { InteractiveModelModalPageModule } from './pages/modals/interactive-model-modal/interactive-model-modal.module';
import { SearchResultDetailsPageModule } from './pages/features/search/search-result-details/search-result-details.module';
import { StaticDataProvider } from './services/static-data/static-data';
import { AuthInterceptor } from './models/AuthInterceptor';
import { EditCategoriesPage } from 'src/app/pages/modals/edit-categories/edit-categories.page';
import { AuthService } from './services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AddRoomModalPageModule,
    LotDetailsPageModule,
    InteractiveModelModalPageModule,
    SearchResultDetailsPageModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Storage,
    // UniqueDeviceID,
    AngularFirestore,
    InAppBrowser,
    SocialSharing,
    Camera,
    Chooser,
    BarcodeScanner,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavParams,
    StaticDataProvider,
    EditCategoriesPage,
    Storage,
    Deeplinks,
    // ThemeableBrowser,
    SafariViewController,
    SignInWithApple
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
