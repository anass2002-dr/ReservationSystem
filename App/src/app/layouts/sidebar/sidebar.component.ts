import { Component, OnInit } from '@angular/core';
import * as arb from '../../../assets/js/Translate/ar.json'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  ar: any = arb
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    // console.log(this.ar);

    // const arTranslations = this.ar;
    // const tags = ['a', 'span', 'h1', 'h2', 'h3', 'h4', 'li']; // List of tags to target

    // tags.forEach(tag => {
    //   // Get all elements for the current tag
    //   const elements = document.getElementsByTagName(tag);

    //   // Iterate over each element
    //   Array.from(elements).forEach((element: Element) => {
    //     // Cast element to HTMLElement to access innerText
    //     const htmlElement = element as HTMLElement;

    //     // Iterate over translation keys
    //     Object.keys(arTranslations).forEach(key => {
    //       // Check if the element's inner text matches the key
    //       if (htmlElement.innerText.trim() === key) {
    //         // Replace the inner text with the corresponding Arabic translation
    //         htmlElement.innerText = arTranslations[key];
    //         console.log(key, htmlElement.innerText);
    //       }
    //     });
    //   });
    // });


  }
  closeMobileSidebar(): void {
    if (window.innerWidth < 992) {
      document.body.classList.remove('mobile-sidebar-open');
      const sidebar = document.getElementById('sidebar');
      sidebar?.classList.remove('mobile-open');
      const backdrop = document.querySelector('.sidebar-backdrop');
      backdrop?.classList.remove('show');
    }
  }

  sidebar_mouse_event() {
    if (window.innerWidth >= 992) {
      const sidebar = document.getElementsByClassName('sidebar');
      if (sidebar.length > 0 && sidebar[0].classList.contains('toggle-sidebar2')) {
        const elements = document.getElementsByClassName('toggle-sidebar-btn');
        if (elements.length > 0) {
          (elements[0] as HTMLElement).click();
        }
      }
    }
  }

}