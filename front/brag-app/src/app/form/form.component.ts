import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import { HttpClient } from '@angular/common/http';

interface FormData {
  achievement: string;
  impact: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formData: FormData = { achievement: '', impact: '', date: '', description: '' };
  items: any[] = [];
  apiUrl = 'http://localhost:3000/api/achievements'; // Backend API URL
  isEditMode = false; // To differentiate between add and edit
  currentEditId: number | null = null; // Store the id of the current item being edited

  constructor(private http: HttpClient) {
    this.loadItems(); // Load existing achievements from the backend
  }

  // Fetch all items from the backend
  loadItems() {
    this.http.get(this.apiUrl).subscribe((data: any) => {
      this.items = data; // Populate the items list
    });
  }

  // Handle form submission for both adding and editing an achievement
  onSubmit() {
    // Format the date to YYYY-MM-DD before sending it to the backend
    this.formData.date = this.formData.date.split('T')[0];
    if (this.isEditMode) {
      // If editing, send a PUT request to update the existing achievement
      this.http.put(`${this.apiUrl}/${this.currentEditId}`, this.formData).subscribe(() => {
        // Update the list locally without reloading all items
        const updatedItemIndex = this.items.findIndex(item => item.id === this.currentEditId);
        if (updatedItemIndex !== -1) {
          this.items[updatedItemIndex] = { ...this.formData, id: this.currentEditId };
        }
        this.resetForm(); // Reset the form
      });
    } else {
      // If adding a new achievement, send a POST request
      this.http.post(this.apiUrl, this.formData).subscribe((newItem: any) => {
        this.items.push(newItem); // Add the new item locally
        this.resetForm(); // Reset the form
      });
      this.items.push({ ...this.formData });
      this.formData = { achievement: '', impact: '', date: '', description: '' };
    }
  }

  // Edit an existing item by loading its data into the form
  editItem(index: number) {
    const item = this.items[index];
    this.formData = { achievement: item.achievement, impact: item.impact, date: item.date, description: item.description };
    this.isEditMode = true;
    this.currentEditId = item.id; // Store the id of the item being edited
    this.formData = { ...this.items[index] };

  }

  // Delete an item from the list and the backend
  deleteItem(index: number) {
    const item = this.items[index];
    this.http.delete(`${this.apiUrl}/${item.id}`).subscribe(() => {
      this.items.splice(index, 1); // Remove the item from the local list
    });
  }


  // Download the list of items as a PDF
  downloadPdf() {
    const doc = new jsPDF();
    let y = 10;

    this.items.forEach(item => {
      doc.text(`achievement: ${item.achievement}`, 10, y);
      y += 10;
      doc.text(`Impact: ${item.impact}`, 10, y);
      y += 10;
      doc.text(`Date: ${item.date}`, 10, y);
      y += 10;
      doc.text(`Description: ${item.description}`, 10, y);
      y += 20;
    });

    doc.save('items.pdf');
  }

  // Reset the form to its initial state
  resetForm() {
    this.formData = { achievement: '', impact: '', date: '', description: '' };
    this.isEditMode = false;
    this.currentEditId = null;
  }
}


