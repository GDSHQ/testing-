        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        const designImage = document.getElementById('designImage');
        const designArea = document.getElementById('designArea');
        const tshirt = document.getElementById('tshirt');
        const tshirtColorSelect = document.getElementById('tshirtColor');
        const designSizeRange = document.getElementById('designSize');
        const sizeValue = document.getElementById('sizeValue');
        const designPositionSelect = document.getElementById('designPosition');
        const clearDesignBtn = document.getElementById('clearDesign');
        const downloadPreviewBtn = document.getElementById('downloadPreview');

        let currentImage = null;

        // File upload functionality
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        imageInput.addEventListener('change', handleFileSelect);

        function handleDragOver(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        }

        function handleDragLeave(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        }

        function handleDrop(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                handleImage(files[0]);
            }
        }

        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImage(file);
            }
        }

        function handleImage(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentImage = e.target.result;
                designImage.src = currentImage;
                designImage.classList.add('visible');
                updateDesign();
            };
            reader.readAsDataURL(file);
        }

        // T-shirt color change
        tshirtColorSelect.addEventListener('change', (e) => {
            tshirt.className = `tshirt ${e.target.value}`;
        });

        // Design size control
        designSizeRange.addEventListener('input', (e) => {
            const size = e.target.value;
            sizeValue.textContent = `${size}%`;
            updateDesignSize(size);
        });

        function updateDesignSize(size) {
            if (currentImage) {
                const scale = size / 100;
                designImage.style.transform = `scale(${scale})`;
            }
        }

        // Design position control
        designPositionSelect.addEventListener('change', (e) => {
            const position = e.target.value;
            designArea.className = `design-area ${position}`;
        });

        // Clear design
        clearDesignBtn.addEventListener('click', () => {
            currentImage = null;
            designImage.src = '';
            designImage.classList.remove('visible');
            imageInput.value = '';
        });

        // Download preview
        downloadPreviewBtn.addEventListener('click', () => {
            if (!currentImage) {
                alert('Please upload an image first!');
                return;
            }

            // Create canvas for download
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 960;

            // Draw t-shirt background
            const tshirtColor = tshirtColorSelect.value;
            const colors = {
                white: '#ffffff',
                black: '#1a1a1a',
                navy: '#2c3e50',
                red: '#e74c3c',
                gray: '#95a5a6'
            };

            ctx.fillStyle = colors[tshirtColor];
            ctx.fillRect(100, 0, 600, 960);

            // Draw the design
            const img = new Image();
            img.onload = function() {
                const position = designPositionSelect.value;
                const size = designSizeRange.value / 100;
                
                let x, y, width, height;
                
                if (position === 'center') {
                    width = 400 * size;
                    height = 400 * size;
                    x = (800 - width) / 2;
                    y = 200;
                } else if (position === 'left') {
                    width = 150 * size;
                    height = 150 * size;
                    x = 180;
                    y = 150;
                } else { // right
                    width = 150 * size;
                    height = 150 * size;
                    x = 470;
                    y = 150;
                }

                ctx.drawImage(img, x, y, width, height);

                // Download the image
                const link = document.createElement('a');
                link.download = 'tshirt-preview.png';
                link.href = canvas.toDataURL();
                link.click();
            };
            img.src = currentImage;
        });

        function updateDesign() {
            updateDesignSize(designSizeRange.value);
        }

        // Add some visual feedback
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });