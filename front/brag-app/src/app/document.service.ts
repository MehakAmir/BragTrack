import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = 'http://localhost:8080/api/document';

    constructor(private http: HttpClient) { }

    createDocument(document: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, document);
    }

    updateDocument(id: number, document: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, document);
    }

    deleteDocument(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getDocuments(keyword?: string, startDate?: Date, endDate?: Date): Observable<any[]> {
        const params: any = {};
        if (keyword) params.keyword = keyword;
        if (startDate) params.start_date = startDate.toISOString().split('T')[0];
        if (endDate) params.end_date = endDate.toISOString().split('T')[0];
        return this.http.get<any[]>(this.apiUrl, { params });
    }
}
