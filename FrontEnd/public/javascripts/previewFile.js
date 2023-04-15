function formatFileSize(size){
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}


document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileSize = formatFileSize(file.size);
            fileInfo.innerHTML = `
            <li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${file.name} • Uploaded</span>
                                <span class="size">${file.type}</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <button id="removeFileButton" type="button" class="removeButton"><i class="fa-solid fa-xmark"></i></button>
                          </li>
            `
            fileInfo.classList.remove('hidden');

            const removeFileButton = document.getElementById('removeFileButton');
            removeFileButton.addEventListener('click', () => {
                fileInput.value = '';
                fileInfo.classList.add('hidden');
            });
        }
        else {
            fileInfo.classList.add('hidden');
        }
    })
})


