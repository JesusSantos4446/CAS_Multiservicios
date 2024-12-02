
        
            const shareButton = document.getElementById('share-button');
            shareButton.addEventListener('click', async () => {
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'Documento para compartir',
                            text: 'Mira este documento importante.',
                            url: window.location.href
                        });
                        console.log('Contenido compartido exitosamente');
                    } catch (error) {
                        console.error('Error al compartir:', error);
                    }
                } else {
                    console.log('La API de compartir no es compatible con este navegador.');
                }
            });
        
            // Imprimir el contenido del div
const printButton = document.getElementById('print-button');
printButton.addEventListener('click', () => {
    const cotizacionContent = document.getElementById('cotizacion').innerHTML;

    // Crear una nueva ventana para la impresión
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Escribir el contenido en la nueva ventana
    printWindow.document.write(`
        <html>
            <head>
                <title>Imprimir Cotización</title>
                <style>
                    /* Aquí van los estilos necesarios para la impresión */
                    @page {
                        size: 8.5in 11in;
                    }
                    body {
                        font-family: Calibri;
                        font-size: 10pt;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                ${cotizacionContent}
            </body>
        </html>
    `);
    
    // Cerrar el documento para que el contenido se renderice
    printWindow.document.close();

    // Esperar a que el contenido se haya cargado antes de imprimir
    printWindow.onload = function() {
        printWindow.focus(); // Enfocar la ventana
        printWindow.print(); // Imprimir el contenido
        printWindow.close(); // Cerrar la ventana después de imprimir
    };
});



        
            const downloadButton = document.getElementById('download-button');
            downloadButton.addEventListener('click', () => {
    fetch(`pdfFormat.html?clientId=${clientId}&quoteId=${quoteId}`)
        .then(response => response.text())
        .then(html => {
            // Crear un elemento temporal para insertar el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Aquí puedes agregar cualquier lógica necesaria para completar la manipulación del DOM
            // Por ejemplo, si necesitas ejecutar scripts dentro de html:
            const scriptTags = tempDiv.getElementsByTagName('script');
            for (let i = 0; i < scriptTags.length; i++) {
                const script = document.createElement('script');
                script.text = scriptTags[i].innerHTML; // Clonamos el contenido del script
                document.body.appendChild(script); // Agregamos al DOM para ejecutar
            }

            // Esperamos un poco para asegurarnos de que los scripts se han ejecutado
            setTimeout(() => {
                // Ahora generamos el PDF
                html2pdf().from(tempDiv).save('COT-0000-CMS0924.pdf');
            }, 100); // Ajusta el tiempo según sea necesario
        })
        .catch(error => console.error('Error al descargar el archivo:', error));
});
            