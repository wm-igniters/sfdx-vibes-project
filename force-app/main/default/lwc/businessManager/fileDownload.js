/**
 * Browser download helpers for files returned by Apex as base64.
 */

/** Decode base64 into a Blob. */
export function base64ToBlob(base64, contentType = 'application/octet-stream') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: contentType });
}

/**
 * Save a Blob as a file: a temporary <a download> link is clicked, then removed.
 * `container` is an element inside the component (lwc:dom='manual') to host the link.
 */
export function saveBlob(blob, fileName, container) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    const host = container ?? document.body;
    host.appendChild(link);
    link.click();
    host.removeChild(link);
    // Give the browser time to start the download before releasing the URL.
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}
