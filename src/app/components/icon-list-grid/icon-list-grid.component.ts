import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { IGrid } from 'src/app/models/dto/interfaces/IGrid';
import { IGridListItem } from 'src/app/models/dto/interfaces/IGridListItem';
import { IGridList } from 'src/app/models/dto/interfaces/IGridList';


@Component({
  selector: 'icon-list-grid',
  templateUrl: './icon-list-grid.component.html',
  styleUrls: ['./icon-list-grid.component.scss'],
})
export class IconListGridComponent implements OnInit {
  @ViewChild('wrap-items') container: ElementRef;

  private defaultIconsToFit = 3;
  private defaultIconWidth = 95;

  public iconsToFit: number = 3;

  showAllItems: boolean = false;
  isListView: boolean = false;
  @Input() _grid: IGrid | any = {} as IGrid;
  @Output() _itemClickEventHandler: any = new EventEmitter();

  dafaultImage = "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fsolid%2Fcamera.svg?alt=media&token=e0af850d-247e-41a0-84ff-e6faa5e815b6";

  constructor() {
    console.log('Hello IconListGridComponent Component');
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.calculateIconsToFit();
  }

  private calculateIconsToFit(): void {
    return;
    const containerWidth = this.container.nativeElement.offsetWidth;
    const a = Math.floor(containerWidth / this.defaultIconWidth);

    this.iconsToFit = a > 0 ? a : this.defaultIconsToFit; 
    debugger;
  }

  public emit(item: IGridListItem, listName: string) {
    let gridList: IGridList = { Items: [item], Name: listName };
    this._itemClickEventHandler.emit(gridList);
  }

  public toggleListAndGridView(event: Event, c: any) {
    c.isListView = !c.isListView;

    event.stopPropagation();
  }

  public toggleSeeAllItemsInList(c: any) {
    c.showAllItems = !c.showAllItems;
  }

}
