import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


interface FormData {
  achievement: string;
  impact: string;
  tags: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formData: FormData = { achievement: '', impact: '', tags: '', date: '', description: '' };
  items: any[] = [];
  filteredItems: any[] = [];
  searchQuery: string = '';
  filterDate: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedTag: string = '';
  apiUrl = 'http://localhost:3000/api/achievements'; 
  isEditMode = false;
  currentEditId: number | null = null; 
  tags = [
    '#Programming', '#Coding', '#SoftwareDevelopment', '#Algorithms', '#DataStructures', '#Python', '#Java', '#JavaScript',
    '#CSharp', '#Ruby', '#WebDevelopment', '#DevOps', '#OpenSource', '#MachineLearning', '#DataScience', '#TechEducation', '#SuccessStories',
    '#TechAchievements', '#CareerGrowth', '#Entrepreneurship', '#Leadership', '#Mentorship', '#ContinuousLearning', '#GoalSetting',
    '#PersonalDevelopment', '#Networking'
  ];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadItems(); // Load existing achievements from the backend
  }
  logout1() {
    localStorage.removeItem('token');
  }
  // Fetch all items from the backend
  loadItems() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      this.http.get(this.apiUrl, { headers }).subscribe(
        (data: any) => {
          this.items = data;
          this.applyFilters();
        },
        error => {
          console.error('Error loading achievements:', error);
          this.snackBar.open('Error loading achievements', 'Close', { duration: 3000 });
        }
      );
    }
  }
  

  // Configuration for Quill editor
  editorModules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };
  logout() {
    localStorage.removeItem('token');
  }
  // Handle form submission for both adding and editing an achievement
  onSubmit() {

    this.formData.date = this.formData.date.split('T')[0];
    const token = localStorage.getItem('token'); 
    console.log('Token:', token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    if (this.isEditMode) {
      this.http.put(`${this.apiUrl}/${this.currentEditId}`, this.formData, { headers }).subscribe(() => {
        const updatedItemIndex = this.items.findIndex(item => item.id === this.currentEditId);
        if (updatedItemIndex !== -1) {
          this.items[updatedItemIndex] = { ...this.formData, id: this.currentEditId };
        }
        this.resetForm(); 
        this.applyFilters(); 
      });
      this.snackBar.open('Achievement updated successfully!', 'Close', { duration: 3000 });
      window.location.reload();
    } else {
      this.http.post(this.apiUrl, this.formData, { headers }).subscribe((newItem: any) => {
        this.items.push(newItem); 
        this.resetForm(); 
        this.applyFilters(); 
      });
      this.snackBar.open('Achievement added successfully!', 'Close', { duration: 3000 });
      window.location.reload();
    }
  }

  // Edit an existing item 
  editItem(index: number) {
    const item = this.items[index];
    this.formData = { achievement: item.achievement, impact: item.impact, tags: item.tags, date: item.date, description: item.description };
    this.isEditMode = true;
    this.currentEditId = item.id; 
  }

  // Delete an item from the list and the backend
  deleteItem(index: number) {
    const item = this.items[index];
    if (item.id !== undefined) {
      this.http.delete(`${this.apiUrl}/${item.id}`).subscribe(() => {
        this.items.splice(index, 1); 
        this.applyFilters(); 
      });
      this.snackBar.open('Achievement deleted successfully!', 'Close', { duration: 3000 });
      window.location.reload();
    } else {
      console.error('Item id is undefined');
    }
  }

  // Download the list of items as a PDF
  downloadPdf() {
    const doc = new jsPDF();
    doc.setFontSize(30);
    doc.setTextColor(0, 102, 204);
    doc.text('BragTrack', 10, 10);
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Achievements List', 10, 20);

    let y = 30; 
    const pageHeight = doc.internal.pageSize.height;
    const margin = 18; 

    // Style for achievements
    this.filteredItems.forEach((item, index) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = 10;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 102, 204);
      doc.text(`Achievement: ${item.achievement}`, 10, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      doc.text(`Impact: ${item.impact}`, 10, y);
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
      doc.text(`Tags: ${item.tags}`, 10, y);
      y += 10;
      doc.text(`Date: ${this.formatDate(item.date)}`, 10, y);
      y += 10;
      const plainDescription = this.stripHtml(item.description);
      doc.text(`Description: ${plainDescription}`, 10, y);
      y += 15;
      if (index < this.filteredItems.length - 1) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = 10;
        }
        doc.line(10, y, 200, y);
        y += 5;
      }
    });

    doc.save('items.pdf');
    this.snackBar.open('PDF downloaded successfully!', 'Close', { duration: 3000 });
  }

  // Helper function to strip HTML tags
  stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  // Method to sanitize HTML content
  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Reset the form to its initial state
  resetForm() {
    this.formData = { achievement: '', impact: '', tags: '', date: '', description: '' };
    this.isEditMode = false;
    this.currentEditId = null;
  }


  // Apply search and filter to items
  applyFilters() {
    let filtered = this.items;

    if (this.searchQuery) {
      filtered = filtered.filter(item =>
        item.achievement.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.impact.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.filterDate) {
      filtered = filtered.filter(item => item.date === this.filterDate);
    }
    if (this.selectedTag) {
      filtered = filtered.filter(item => item.tags.includes(this.selectedTag));
    }

    this.filteredItems = filtered;

  }
  onTagChange() {
    this.applyFilters();
  }

  // New function for filtering by date range
  filterByDateRange() {
    let filtered = this.items;

    if (this.startDate) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(this.startDate));
    }
    if (this.endDate) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(this.endDate));
    }

    this.filteredItems = filtered;
  }
  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options); 
  }


}

