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

	seeAllItems(Items, index){
			let list = this._grid.Lists[index]
			this._grid.Lists[index] = {...list, showAllItems: !list?.showAllItems};

	}

}
