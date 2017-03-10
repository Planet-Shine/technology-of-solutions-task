

$(function () {
    var idCounter = 0,
        getNextId = function () {
            return idCounter++;
        },
        data = {
            purchases: []
        },
        box = $('.purchase-container'),
        ul = box.find('.purchase-list'),
        modifiers = {
            newBox: 'purchase-container_new',
            addItem: 'purchase-item_add',
            editItem: 'purchase-item_edit'
        },
        purchaseItemTemplate = $('#purchase-template').html();


    $('.new-button').click(function () {
        box.addClass(modifiers.newBox);
        box.find('.purchase-item:last')
            .addClass(modifiers.addItem)
            .find('input')
            .focus();
    });

    $(document).click(function (event) {
        var target = $(event.target),
            id,
            input,
            purchaseItem;
        if (target.is('.edit-button')) {
            if (target.closest('.purchase-item__reading').length) {
                clearEditing();
                editingItem(target);
            } else {
                editItem(target);
            }
        } else if (target.is('.cancel-button')) {
            cancelEditing(target);
        } else if (target.is('.add-button')) {
            clearEditing();
            addItem(target);
        } else if (target.is('.delete-button')) {
            clearEditing();
            purchaseItem = target.closest('.purchase-item');
            id = parseInt(purchaseItem.data('id'), 10);
            purchaseItem.remove();
            data.purchases.forEach(function (item, index) {
                if (item.id === id) {
                    data.purchases.splice(index, 1);
                }
            });
        }
    });

    $(document).submit(function (event) {
        var target = $(event.target);
        event.preventDefault();
        if (target.closest('.' + modifiers.addItem).length) {
            addItem(target);
        } else if (target.closest('.' + modifiers.editItem).length) {
            editItem(target);
        }
        return false
    });

    ul.html(purchaseItemTemplate.replace('{caption}', ''));

    function clearEditing() {
        box.find('.' + modifiers.editItem).removeClass(modifiers.editItem);
        cancelNew();
    }

    function cancelNew() {
        box.removeClass(modifiers.newBox);
        box.find('.purchase-item:last')
            .removeClass(modifiers.addItem);
    }

    function editingItem(target) {
        var purchaseItem = target.closest('.purchase-item'),
            id = parseInt(purchaseItem.data('id'), 10),
            value = data.purchases.filter(function (item) {
                return item.id === id;
            })[0].value;
        purchaseItem.addClass(modifiers.editItem);
        purchaseItem.find('input').val(value).focus();
    }

    function editItem(target) {
        var purchaseItem = target.closest('.purchase-item'),
            input = purchaseItem.find('input'),
            id = parseInt(purchaseItem.data('id'), 10);
        data.purchases.forEach(function (item) {
            if (item.id === id) {
                data.purchases.value = input.val();
            }
        });
        purchaseItem.find('.purchase-caption').html(input.val());
        cancelEditing(target);
    }

    function edit (target) {
        var purchaseItem;
        purchaseItem = target.closest('.purchase-item');
        purchaseItem.addClass(modifiers.editItem);
        purchaseItem.find('input').focus();
    }

    function addItem(target) {
        var purchaseItem,
            input,
            id;
        purchaseItem = target.closest('.purchase-item');
        input = purchaseItem.find('input');
        id = getNextId();
        purchaseItem.before(
            purchaseItemTemplate
                .replace('{caption}', input.val())
                .replace('{id}', id)
        );
        data.purchases.push({
            id: id,
            value: input.val()
        });
        input.val('');
        cancelNew();
    }

    function cancelEditing(target) {
        var purchaseItem = target.closest('.purchase-item');
        purchaseItem.find('input').val('');
        purchaseItem.removeClass(modifiers.editItem);
        purchaseItem.removeClass(modifiers.addItem);
        cancelNew();
    }

});