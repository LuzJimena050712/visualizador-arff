from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import io

def index(request):
    return render(request, 'visualizador/index.html')

@csrf_exempt
def upload_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        
        if not uploaded_file.name.endswith('.arff'):
            return JsonResponse({'error': 'El archivo debe ser .arff'}, status=400)
        
        try:
            content = uploaded_file.read().decode('utf-8')
            
            lines = content.split('\n')
            
            data_section = False
            data_lines = []
            attributes = []
            
            for line in lines:
                line = line.strip()
                
                if line.startswith('@attribute') or line.startswith('@ATTRIBUTE'):
                    parts = line.split()
                    if len(parts) >= 2:
                        attr_name = parts[1]
                        attributes.append(attr_name)
                
                if line.lower() == '@data':
                    data_section = True
                    continue
                
                if data_section and line and not line.startswith('%'):
                    data_lines.append(line)
            
            rows = []
            for line in data_lines[:100]:
                row = line.split(',')
                rows.append(row)
            
            result = {
                'columns': attributes,
                'data': rows,
                'total_rows': len(data_lines),
                'total_cols': len(attributes)
            }
            
            return JsonResponse(result)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'No se recibió ningún archivo'}, status=400)