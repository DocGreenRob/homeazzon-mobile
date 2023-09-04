import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from "@angular/core";
import { GestureController } from "@ionic/angular";
import { SegmentItem } from "src/app/models/SegmentItem";

@Component({
  selector: "app-segment-selector",
  templateUrl: "./segment-selector.component.html",
  styleUrls: ["./segment-selector.component.scss"],
})
export class SegmentSelectorComponent implements OnInit {
  @Input() initView: SegmentItem;
  @Input() segments: Array<SegmentItem> = new Array();
  @Output() selectedSegment: EventEmitter<any> = new EventEmitter();

  constructor(private gestureCtrl: GestureController) {
    //this.handleGestureMovmts();
  }

  ngOnInit() {
    //console.log(this.segmentEl.nativeElement);
  }

  handleSegmentClick(segmentItem: SegmentItem) {
    this.initView = segmentItem;
    this.selectedSegment.emit(segmentItem.value);
  }

  // handleGestureMovmts() {
  //   const gesture = this.gestureCtrl.create({
  //     el: this.segmentEl.nativeElement,
  //     threshold: 15,
  //     gestureName: 'my-gesture',
  //     onMove: ev => this.onMove(ev)
  //   });

  // }

  private onMove(detail) {
    const type = detail.type;
    const currentX = detail.currentX;
    const deltaX = detail.deltaX;
    const velocityX = detail.velocityX;

    console.log(`
      <div>Type: ${type}</div>
      <div>Current X: ${currentX}</div>
      <div>Delta X: ${deltaX}</div>
      <div>Velocity X: ${velocityX}</div>
    `);
  }
}
