import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { IGrid } from 'src/app/models/dto/interfaces/IGrid';
import { IGridListItem } from 'src/app/models/dto/interfaces/IGridListItem';
import { IGridList } from 'src/app/models/dto/interfaces/IGridList';


@Component({
	selector: 'tags-filter',
	templateUrl: './tags-filter.component.html',
	styleUrls: ['./tags-filter.component.scss'],
})
export class TagsFilterComponent implements OnInit {

	tagsList: IGridList;

	//@Input() _grid: IGrid = {} as IGrid;
	@Output() _itemClickEventHandler: any = new EventEmitter();

	constructor(private modalController: ModalController, ) {
		console.log('Hello TagsFilterComponent Component');
	}

	ngOnInit() {
		//console.log(this._grid);
	}

	dismiss() {
		this.modalController.dismiss();
	}

	//public emit(item: IGridListItem, listName: string) {
	//	let gridList: IGridList = { Items: [item], Name: listName };
	//	this._itemClickEventHandler.emit(gridList);
	//}

}
