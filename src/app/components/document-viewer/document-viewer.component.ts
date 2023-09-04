import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras, Router } from '@angular/router';
import { DocumentFileTypes } from 'src/app/common/Constants';


@Component({
  selector: 'document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent implements OnInit {

  @Input() set docUrl(value: any) {
    this._plainUrl = value;
    value = encodeURI(value);
    const link = `https://docs.google.com/gview?url=${value}&embedded=true&hl=Nl`;
    this._docUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);

  }

  @Input() set fileType(value: any) {
    this._fileType = value;
  }

  @Input() set title(value: any) {
    this._title = value;
  }

  _fileType: any;
  _docUrl: any;
  _title: any;
  _plainUrl: any;
  _docTypes = DocumentFileTypes;

  constructor(private sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit() { }

  viewDesign() {
    let navExtras: NavigationExtras = {
      queryParams: { title: this._title, pdfUrl: this._plainUrl }
    };

    this.router.navigate(['single-design-plan'], navExtras)
  }

  get DisplayFullDocument(): boolean {
    if (this._fileType == this._docTypes.pdf) {
      return true;
    }
    return false;
  }



}
