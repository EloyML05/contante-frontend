import { Component, OnInit } from '@angular/core';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipoasiento.admin.view.routed',
  templateUrl: './tipoasiento.admin.view.routed.component.html',
  styleUrls: ['./tipoasiento.admin.view.routed.component.css']
})
export class TipoasientoAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  route: string = '';
  oTipoAsiento: ITipoasiento = {} as ITipoasiento;
  
  constructor(private oActivatedRoute: ActivatedRoute, private oTipoAsientoService: TipoAsientoService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }
  getOne() {
    this.oTipoAsientoService.getOne(this.id).subscribe({
      next: (data: ITipoasiento) => {
        this.oTipoAsiento = data;
      },
    });
  }

}
