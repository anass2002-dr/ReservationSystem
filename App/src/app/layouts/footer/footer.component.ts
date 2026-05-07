import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent implements OnInit {

  constructor() { }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Optionally, you can add a method to show/hide the back-to-top button based on scroll position
  ngOnInit() {
    window.addEventListener('scroll', this.toggleBackToTopButton);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.toggleBackToTopButton);
  }

  toggleBackToTopButton = () => {
    const backToTopButton = document.querySelector('.back-to-top') as HTMLElement;
    if (window.scrollY > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
}
