const deleteListingButtons = document.querySelectorAll(".deleteListingConfirm");
const deleteReviewButtons = document.querySelectorAll(".deleteReviewConfirm");

// --------------------------------------------------------------------------------------------

deleteListingButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        const comfirmation = confirm(
            "Are you sure you want to delete this listing?"
        );
            if(comfirmation){
                btn.closest("form").submit();
            };
    });
});

// --------------------------------------------------------------------------------------------

deleteReviewButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        const comfirmation = confirm(
            "Are you sure you want to delete this review?"
        );
            if(comfirmation){
                btn.closest("form").submit();
            };
    });
});