import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipoapunte } from '../../../model/tipoapunte.interface';
import { TipoApunteService } from '../../../service/tipoapunte.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TipocuentaAdminSelectorUnroutedComponent } from '../../tipocuenta/tipocuenta.admin.selector.unrouted/tipocuenta.admin.selector.unrouted.component';

@Component({
  selector: 'app-tipoapunte.admin.selector.unrouted',
  templateUrl: './tipoapunte.admin.selector.unrouted.component.html',
  styleUrls: ['./tipoapunte.admin.selector.unrouted.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class TipoApunteAdminSelectorUnroutedComponent implements OnInit {
  oPage: IPage<ITipoapunte> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();
  readonly dialogRef = inject(
    MatDialogRef<TipocuentaAdminSelectorUnroutedComponent>
  );
  //readonly data = inject(MAT_DIALOG_DATA ) ;public id= {id:number});

  constructor(
    private oTipoApunteService: TipoApunteService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    console.log(this.data.id);
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oTipoApunteService
      .getRestPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.data.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<ITipoapunte>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oTipoApunte: ITipoapunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipoapunte/edit', oTipoApunte.id]);
  }

  view(oTipoApunte: ITipoapunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipoapunte/view', oTipoApunte.id]);
  }

  remove(oTipoApunte: ITipoapunte) {
    this.oRouter.navigate(['admin/tipoapunte/delete/', oTipoApunte.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }
  select(oTipoapunte: ITipoapunte) {
    this.dialogRef.close(oTipoapunte);
  }
  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }
 
}
