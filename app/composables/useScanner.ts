import { BrowserMultiFormatReader, BrowserCodeReader } from "@zxing/browser";

export function useBarcodeScanner() {
  let controls: Awaited<
    ReturnType<BrowserCodeReader["decodeFromVideoDevice"]>
  > | null = null;
  const codeReader = new BrowserMultiFormatReader();

  async function getCameraOrThrow() {
    if (!window.isSecureContext) {
      throw new Error("Camera access requires HTTPS.");
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera API not supported by this browser.");
    }

    const devices = await BrowserCodeReader.listVideoInputDevices();

    if (!devices.length) {
      throw new Error("No camera found on this device.");
    }

    // Prefer back camera
    return (
      devices.find((d) => d.label.toLowerCase().includes("back"))?.deviceId ||
      devices[0]?.deviceId
    );
  }

  async function startScan(
    video: HTMLVideoElement,
    onScan: (code: string) => void,
  ) {
    const deviceId = await getCameraOrThrow();

    controls = await codeReader.decodeFromVideoDevice(
      deviceId,
      video,
      (result, error) => {
        if (result) {
          onScan(result.getText());
          stopScan(video);
        }
      },
    );
  }

  function stopScan(video?: HTMLVideoElement | null) {
    controls?.stop();
    controls = null;

    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }

  return { getCameraOrThrow, startScan, stopScan };
}
