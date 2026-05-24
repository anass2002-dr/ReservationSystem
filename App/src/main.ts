import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import $ from 'jquery';
if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

export namespace ReservationPG {
  const sessionName = 'reservationPGlogin';
  const urlServer = `${environment.ApiUrl}/`;
  export const title_header = function (route: ActivatedRoute): string[] {
    var breadcrumbs: string[] = [];
    breadcrumbs.push('Home');
    for (const x of route.snapshot.url) {
      breadcrumbs.push(x.path);
    }

    return breadcrumbs;
  }

  export const formatBreadcrumb = function (breadcrumb: string): string {
    return breadcrumb.replace(/[_-]/g, ' ');
  }
  export const formatBreadcrumbLink = function (breadcrumb: string, list: any[]): string {

    let str = ""
    $.each(list, (index: any, val: any) => {
      if (index <= list.indexOf(breadcrumb) && val != "Home") {
        str += val + '/'
      }
    })
    return str;
  }

  export function closeModelErp(): void {
    const erp_model = document.getElementById('model_erp')
    if ($('#model_erp').hasClass('d-none')) {
      erp_model?.classList.remove('d-none')
    }
    else {
      erp_model?.classList.add('d-none')

    }
  }
  export function closeModeleDelete(): void {
    const erp_model = document.getElementById('model_delete')
    if ($('#model_delete').hasClass('d-none')) {
      erp_model?.classList.remove('d-none')
    }
    else {
      erp_model?.classList.add('d-none')

    }
  }

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast: any) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  export var idDossier = "";
  // app();
  forms();
  export function app(): void {
    // const localStorageItem = sessionStorage.getItem(sessionName);
    // if (!localStorageItem) {
    //   // if (window.location.href.indexOf('/pages-login') === -1) {
    //   //   // window.location.href = '/pages-login';
    //   // }
    // }
  }
  export async function getData(apiUrl: string, requestData: Record<string, any>) {
    apiUrl += "?"
    for (const key in requestData) {
      if (requestData.hasOwnProperty(key)) {
        const value = requestData[key];
        apiUrl += `${key}=${value}&`
      }
    }
    try {
      const response = await fetch(urlServer + apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.isSucces)
        return data.dataResult;
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
    }
  }
  export async function postData(apiUrl: string, requestData: Record<string, any>) {
    try {
      const response = await fetch(urlServer + apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.isSucces) {
        ReservationPG.success(data.message)
        return data.dataResult;
      }
      else {
        ReservationPG.warning(data.message)
        return null
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      return null
    }
  }
  export function convertFormToJson(form: FormGroup): void {
    const formData = { ...form.value };
    return formData
  }
  export function forms(): void {
    const forms = document.querySelectorAll('form');
    Array.from(forms).forEach((form: HTMLFormElement) => {
      form.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        ReservationPG.warning('Warning')
      }, false);
    });
  };
  export function saveSession(dt: any): void {
    sessionStorage.setItem(sessionName, JSON.stringify(dt));
  }
  export function getSession(): Record<string, any> | undefined {
    const item = sessionStorage.getItem(sessionName);
    if (item) {
      try {
        return JSON.parse(item) as Record<string, any>;
      } catch (error) {

      }
    }
    return undefined;
  }
  export function removeSession() {
    sessionStorage.removeItem(sessionName);
  }
  export function success(msg: string) {
    Toast.fire({
      icon: "success",
      title: msg
    });
  }
  export function error(msg: string) {
    Toast.fire({
      icon: 'error',
      title: (msg)
    })
  }
  export function warning(msg: string) {
    Toast.fire({
      icon: 'warning',
      title: (msg)
    })
  }
  export function alert(title: string, msg: string, ok: () => void, cancel: () => void) {
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal', 'd-none');
    modalElement.setAttribute('role', 'dialog');

    const modalDialogElement = document.createElement('div');
    modalDialogElement.classList.add('modal-dialog', 'modal-md', 'modal-dialog-centered', 'alert');

    const modalContentElement = document.createElement('div');
    modalContentElement.classList.add('modal-content');
    const modalHeaderElement = document.createElement('div');
    modalHeaderElement.classList.add('modal-header');

    const modalTitleElement = document.createElement('h5');
    modalTitleElement.classList.add('modal-title');
    modalTitleElement.textContent = title;

    const closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('btn-close');
    closeButtonElement.innerHTML = '<i class="fa-solid fa-x"></i>';

    modalHeaderElement.appendChild(modalTitleElement);
    modalHeaderElement.appendChild(closeButtonElement);
    const modalBodyElement = document.createElement('div');
    modalBodyElement.classList.add('modal-body');
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    const columnElement = document.createElement('div');
    columnElement.classList.add('col-12');
    columnElement.textContent = msg;
    rowElement.appendChild(columnElement);
    modalBodyElement.appendChild(rowElement);
    const modalFooterElement = document.createElement('div');
    modalFooterElement.classList.add('modal-footer');
    const cancelButtonElement = document.createElement('button');
    cancelButtonElement.classList.add('btn', 'btn-light', 'btn-annuler', 'btn-rounded');
    cancelButtonElement.textContent = 'Cancel';
    const saveButtonElement = document.createElement('button');
    saveButtonElement.classList.add('btn', 'btn-success', 'btn-sauvegarder', 'btn-rounded', 'mx-2');
    saveButtonElement.textContent = 'OK';
    modalFooterElement.appendChild(cancelButtonElement);
    modalFooterElement.appendChild(saveButtonElement);
    modalContentElement.appendChild(modalHeaderElement);
    modalContentElement.appendChild(modalBodyElement);
    modalContentElement.appendChild(modalFooterElement);
    modalDialogElement.appendChild(modalContentElement);
    modalElement.appendChild(modalDialogElement);
    saveButtonElement.addEventListener('click', () => {
      ok();
      ReservationPG.hide(modalElement);
      modalElement.remove();
    });
    cancelButtonElement.addEventListener('click', () => {
      cancel();
      ReservationPG.hide(modalElement);
      modalElement.remove();
    });
    document.body.appendChild(modalElement);
    ReservationPG.show(modalElement);
  }
  export function hide(element: HTMLElement): void {
    element.classList.add('scale-out-center');
    element.classList.add('d-none');

    setTimeout(() => {
      element.classList.remove('scale-out-center');
    }, 1000);
  }
  export function show(element: HTMLElement): void {
    element.classList.add('scale-in-center');

    setTimeout(() => {
      element.classList.remove('d-none');
    }, 100);
  }
}
