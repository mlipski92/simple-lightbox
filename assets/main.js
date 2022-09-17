const sgTemplates = {
    modal: function(id) {

        return `
        <div class="simpleJsGallery__nav--left">
            <a href="javascript:void(0)" class="simpleJsGallery__nav-a">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30">
                    <path id="Polygon_1" data-name="Polygon 1" d="M15,0,30,26H0Z" transform="translate(0 30) rotate(-90)" fill="#fff"/>
                </svg>                  
            </a>
        </div>

        <div class="simpleJsGallery__nav--right">
            <a href="javascript:void(0)" class="simpleJsGallery__nav-a">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30">
                    <path id="Polygon_1" data-name="Polygon 1" d="M15,0,30,26H0Z" transform="translate(26) rotate(90)" fill="#fff"/>
                </svg>
                                
            </a>
        </div>

        <div class="simpleJsGallery__closeButton">
            <a href="javascript:void(0)">
                <svg xmlns="http://www.w3.org/2000/svg" width="27.577" height="27.577" viewBox="0 0 27.577 27.577">
                    <g id="Group_1" data-name="Group 1" transform="translate(-302.211 -326.711)">
                    <rect id="Rectangle_1" data-name="Rectangle 1" width="8" height="31" transform="translate(324.132 326.711) rotate(45)" fill="#fff"/>
                    <rect id="Rectangle_2" data-name="Rectangle 2" width="8" height="31" transform="translate(329.789 348.632) rotate(135)" fill="#fff"/>
                    </g>
                </svg>                  
            </a>
        </div>

        <div class="simpleJsGallery__bigPicture">
            <img src="img/hala_lipowska.jpg" alt="" class="simpleJsGallery__imgBig">
            <span class="sgSmallPictures__title"></span>
        </div>
        <div class="simpleJsGallery__smallPictures sgSmallPictures">
            <ul class="sgSmallPictures__list"></ul>
        </div>
        `
    },
    galleryThumbnailItem: function(link, src, alt) {
        return `
            <a href="${link}" class="sgSmallPictures__a">
                <div class="sgSmallPictures__mask"></div>
                <img src="${src}" alt="${alt}" class="sgSmallPictures__img">
            </a>
        `;
    }
}

class simpleGallery {
    /* constructor */
    constructor(sgDomElement) {
        this.sgDomElement = sgDomElement;
        this.galleryItems = document.querySelectorAll("#" + sgDomElement + ".simpleJsGallery .simpleJsGallery__item");

        this.checkGalleryItems();
    }

    /* variables */
    pictures = [];
    currentItem = null;
    thumbnails = new Array(4);

    /* checking signed images on website and adding click events */
    checkGalleryItems() {
        let tempElement = null;
        let i = 0;
        this.galleryItems.forEach(el => {
            tempElement = {};
            if(el.children[0].tagName === 'IMG') {
                tempElement.id = i;
                tempElement.title = el.children[0].alt;
                tempElement.href = el.href;

                el.dataset.sgId = i;
                el.href="javascript:void(0)";

                this.pictures.push(tempElement);
                i++;
            } else {
                el.removeAttribute('href');
                el.innerHTML = "<span><strong>Błąd!</strong> Nie znaleziono obrazka! Przeczytaj jeszcze raz dokumentację!</span>";
            }
        });
        this.addClickEvents();
    }
    addClickEvents() {
        
        /* click events of thumbnails on website */
        for(let i = 0; i < this.galleryItems.length; i++) {
            if (this.galleryItems[i].dataset.sgId !== undefined) {
                this.galleryItems[i].addEventListener("click", () => {
                    this.openModal(this.galleryItems[i].dataset.sgId);
                });
            }
        }

    }
    modalAddClickEvents() {

        /* modal click events */
        const closeButton = document.querySelector(".simpleJsGallery__closeButton > a");
        const goPrev = document.querySelector(".simpleJsGallery__nav--left .simpleJsGallery__nav-a");
        const goNext = document.querySelector(".simpleJsGallery__nav--right .simpleJsGallery__nav-a");

        closeButton.addEventListener("click", () => {
            this.closeModal();
        });
        goNext.addEventListener("click", () => {
            if(this.pictures.length > this.currentItem + 1) {
                this.nextPicture();
            } else {
                this.firstPicture();
            }  
        });
        goPrev.addEventListener("click", () => {
            if(0 <= this.currentItem - 1) {
                this.prevPicture();
            } else {
                this.lastPicture();
            }  
        });
    }

    /* modal nav */
    nextPicture() {
        this.currentItem++;
        this.loadPicture();
    }
    prevPicture() {
        this.currentItem--;
        this.loadPicture();
    }
    firstPicture() {
        this.currentItem = 0;
        this.loadPicture();
    }
    lastPicture() {
        this.currentItem = this.pictures.length -1;
        this.loadPicture();
    }

    /* close/open modal */
    openModal(id) {
        this.currentItem = id;
        const newModal = document.createElement("div");
        const bodyElement = document.querySelector("body");

        newModal.classList.add("simpleJsGallery__container");
        newModal.innerHTML = sgTemplates.modal(id);
        bodyElement.append(newModal);

        this.loadPicture();
        this.modalAddClickEvents();
    }
    closeModal(){
        const modal = document.querySelector(".simpleJsGallery__container");
        modal.remove();
    }

    /* load picture */
    loadPicture() {
        const bigPicture = document.querySelector(".simpleJsGallery__imgBig");
        const selectedItem = this.pictures.find(el => el.id == this.currentItem);

        bigPicture.src = selectedItem.href;
        bigPicture.alt = selectedItem.title;

        this.typeThumbnails();
    }

    /* thumbnails */
    typeThumbnails() {
       
        if (this.currentItem !== null) {
            let counterPhoto = parseInt(this.currentItem);

            for (let i = 0; i <= 3; i++) {
                this.thumbnails[i] = counterPhoto;
    
                if (counterPhoto < this.pictures.length-1) {
                    counterPhoto++;
                } else {
                    counterPhoto = 0;
                }
            }

            this.loadThumbnails();
        }
    }
    loadThumbnails() {
        const thumbnailList = document.querySelector(".sgSmallPictures__list");
        let itemTemp = null;
        thumbnailList.innerHTML = "";

        this.thumbnails.forEach(el => {
            itemTemp = this.pictures.find(picture => picture.id == el);

            const newThumbnail = document.createElement("li");
            newThumbnail.classList.add("sgSmallPictures__item");
            if(el == this.currentItem) newThumbnail.classList.add("active");
            newThumbnail.innerHTML = sgTemplates.galleryThumbnailItem(null, itemTemp.href, itemTemp.title);
            thumbnailList.append(newThumbnail);
            
        });


    }

}



