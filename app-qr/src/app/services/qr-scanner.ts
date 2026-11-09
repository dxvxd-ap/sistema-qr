import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class QrScannerService {

    async scan(): Promise<string | null> {
        if (capacitorIsWeb()) {
            return prompt('Ingresa o pega el código QR:', 'UTGZ|Sesión 1|10° A|1794200000|UTGZ-20261108-1234');
        }

        try {
            const { BarcodeScanner } = await import('@capacitor-community/barcode-scanner');

            const status = await BarcodeScanner.checkPermission({ force: true });

            if (status.granted) {
                BarcodeScanner.hideBackground();
                document.body.classList.add('scanner-active');

                const result = await BarcodeScanner.startScan();

                BarcodeScanner.stopScan();
                document.body.classList.remove('scanner-active');

                if (result.hasContent) {
                    return result.content;
                }
            } else {
                alert('Se requieren permisos de cámara.');
            }
            return null;
        } catch (e) {
            console.error('Error al iniciar el escáner:', e);
            return prompt('Ingresa el código QR manualmente:');
        }
    }
}

function capacitorIsWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
}