import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AnalysisResult {
  score: number;
  summary: string;
  good_areas: string[];
  issues: string[];
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

@Injectable({ providedIn: 'root' })
export class AnalyzeService {

  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  private readonly MODELS = [
    'google/gemma-3-12b-it:free',
    'google/gemma-3-27b-it:free',
    'google/gemma-3-4b-it:free',
    'mistralai/mistral-small-3.1-24b-instruct:free',
  ];

  constructor(private http: HttpClient) {}

  analyze(base64Image: string): Observable<OpenRouterResponse> {
    return this.tryModel(base64Image, 0);
  }

  private tryModel(base64Image: string, index: number): Observable<OpenRouterResponse> {
    if (index >= this.MODELS.length) {
      throw new Error('Todos los modelos fallaron');
    }

    console.log(`Intentando con: ${this.MODELS[index]}`);

    return this.callModel(base64Image, this.MODELS[index]).pipe(
      catchError(() => {
        console.warn(`${this.MODELS[index]} falló, probando siguiente...`);
        return this.tryModel(base64Image, index + 1);
      })
    );
  }

  private callModel(base64Image: string, model: string): Observable<OpenRouterResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.openRouterKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            },
            {
              type: 'text',
              text: `You are an accessibility expert analyzing a website screenshot for WCAG compliance.You need to be very strict about your grading, if you detect any potential issue that could cause accessibility problems for users with disabilities, you should include it in the issues list.

              You should also try to let know the user which areas have a good accessibility and which ones need improvement.

              It's also important have the overall style of the page, if for example the structurue is only on one column or hight contrast colors this should be an issue and be reflected at the score.
              
              Respond ONLY with a valid JSON object, no markdown, no extra text, but feel free to add or rest both of "good areas" and "issues" if you think they are relevant:
              {
                "score": <number from 0 to 100>,
                "summary": "<one sentence overview>",
                "good_areas": ["<good area 1>", "<good area 2>","<good area 3>"],
                "issues": ["<issue 1>", "<issue 2>", "<issue 3>", "<issue 4>"] 
              }
              
              Score guide:
              - 0-40: critical accessibility problems
              - 41-70: several issues to fix
              - 71-90: good but improvable
              - 91-100: excellent accessibility
              
              
              You should also detected if the img provided isn't a website screenshot or if the image is too blurry to analyze, in that case respond with a score of 0 and an issue indicating the problem. You can give the following format: 
              
                     {
                "score": 0,
                "summary": "Error: The image provided is not a website screenshot or is too blurry to analyze",
                "good_areas": [""],
                "issues": [""] 
              }`

              
            }
          ]
        }
      ]
    };

    return this.http.post<OpenRouterResponse>(this.API_URL, body, { headers });
  }

  parseResult(response: OpenRouterResponse): AnalysisResult {
    try {
      const content = response.choices[0].message.content;
      const clean = content.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      return {
        score: 0,
        summary: 'Error al procesar la respuesta',
        good_areas: ['No se pudo analizar la imagen'],
        issues: ['No se pudo analizar la imagen']
      };
    }
  }
}