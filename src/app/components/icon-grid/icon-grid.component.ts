import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IGrid } from 'src/app/models/dto/interfaces/IGrid';
import { IGridListItem } from 'src/app/models/dto/interfaces/IGridListItem';
import { IGridList } from 'src/app/models/dto/interfaces/IGridList';


@Component({
	selector: 'icon-grid',
	templateUrl: './icon-grid.component.html',
	styleUrls: ['./icon-grid.component.scss'],
})
export class IconGridComponent implements OnInit {
	showAllItems: boolean = false;
	@Input() _grid: IGrid | any = {} as IGrid;
	@Output() _itemClickEventHandler: any = new EventEmitter();
	
	dafaultImage = "https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fsvgs%2Fsolid%2Fcamera.svg?alt=media&token=e0af850d-247e-41a0-84ff-e6faa5e815b6";

	constructor() {
		console.log('Hello IconGridComponent Component');
	}

	ngOnInit() {
		console.log(this._grid);
	}

	public emit(item: IGridListItem, listName: string) {
		let gridList: IGridList = { Items: [item], Name: listName };
		this._itemClickEventHandler.emit(gridList);
  }

  public toggleSeeAllItemsInList(c: any) {
    c.showAllItems = !c.showAllItems;
  }

}
