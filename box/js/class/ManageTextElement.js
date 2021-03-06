ManageTextElement = function(id, canvasId, canvasWidth, elementsId) {
    this.canvasId = canvasId;

    this.canvas = document.getElementById(canvasId);
    this.canvas.onmousemove = this.mouseMove;
    this.canvas.onmousedown = this.mouseDown;
    this.canvas.onmouseup = this.mouseUp;

    this.canvas.width = canvasWidth;
    this.canvas.height = this.canvas.width / 1.77;
    
    this.context = this.canvas.getContext('2d');
    this.context.width = this.canvas.width;
    this.context.height = this.canvas.height;
    
    this.elementsId = elementsId;

    this.isEditing = false;
};

ManageTextElement.prototype.newTextElement = function(id) {
    this.id = id;
    this.fileId = null;

    this.text = 'Text ' + id;
    
    this.properties = {
        pos: {x: (this.canvas.width / 2), y: (this.canvas.height / 2)},
        font: 'Calibri',
        size: 50,
        color: '#000000',
        align: 'center'
    };

    this.widthLine = 0;

    this.leftClick = false;
    this.isSelected = false;

    document.getElementById(this.elementsId.colorText).value = this.properties.color;

    document.getElementById(this.elementsId.sizeText).value = this.properties.size;
    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = this.properties.size;
    document.getElementById(this.elementsId.textArea).value = this.text;
    document.getElementById(this.elementsId.textArea).focus();


    this.isEditing = false;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.editTextElement = function(id, fileId, text, properties) {
    //Editor
    this.id = id;
    this.fileId = fileId;
    this.text = text;
    
    this.properties = properties;

    this.widthLine = 0;

    this.leftClick = false;
    this.isSelected = false;

    document.getElementById(this.elementsId.colorText).value = this.properties.color;

    document.getElementById(this.elementsId.sizeText).value = this.properties.size;
    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = this.properties.size;

    this.isEditing = true;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.gInformationsTextElement = function() {
    return {id : this.id, text : this.text, properties: this.properties};
};

ManageTextElement.prototype.changeFont = function(font) {
    this.properties.font = font;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeSizeText = function(sizeText) {
    this.properties.size = sizeText;

    document.getElementById(this.elementsId.sizeTextInfo).innerHTML = sizeText;

    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeColor = function(color) {
    this.properties.color = color;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.changeTextAlign = function(textAlign) {
    this.properties.align = textAlign;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.updateText = function(text) {
    this.text = text;
    this.writeTextToCanvas();
};

ManageTextElement.prototype.writeTextToCanvas = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.font = this.properties.size + 'pt ' + this.properties.font;
    this.context.textAlign = this.properties.align;
    this.context.fillStyle = this.properties.color;

    var enterInContent = this.text.split('\n');

    this.widthLine = 0;

    for(var i = 0; i < enterInContent.length; i++)
    {
        if(this.context.measureText(enterInContent[i]).width > this.widthLine)
        {
            this.widthLine = Math.round(this.context.measureText(enterInContent[i]).width);
        }

        this.context.fillText(enterInContent[i], this.properties.pos.x, (this.properties.pos.y + ((i * this.properties.size) + 5)));
    }

    var xWidth = 0;

    if(this.properties.align == 'center')
    {
        xWidth = (this.widthLine / 2);
    }
    else if(this.properties.align == 'right')
    {
        xWidth = this.widthLine;
    }

    this.context.fillStyle = 'rgba(180, 217, 243, 0.2)';
    this.context.fillRect(((this.properties.pos.x - xWidth) - 5), ((this.properties.pos.y - this.properties.size)), (this.widthLine + 10), ((enterInContent.length * this.properties.size) + 15));

    this.context.fillStyle = (this.isSelected) ? 'rgba(173, 250, 190, 1)' : 'rgba(221, 248, 251, 1)';
    this.context.fillRect(((this.properties.pos.x - xWidth) - 5), (this.properties.pos.y - this.properties.size), (this.widthLine + 10), 1);
    this.context.fillRect((((this.properties.pos.x - xWidth) - 5 + (this.widthLine + 10)) - 1), (this.properties.pos.y - this.properties.size), 1, ((enterInContent.length * this.properties.size) + 15));
    this.context.fillRect((((this.properties.pos.x - xWidth) - 5)), (((this.properties.pos.y - this.properties.size) + ((enterInContent.length * this.properties.size) + 15)) - 1), (this.widthLine + 10), 1);
    this.context.fillRect(((this.properties.pos.x - xWidth) - 5), (this.properties.pos.y - this.properties.size), 1, ((enterInContent.length * this.properties.size) + 15));

    document.getElementById(this.elementsId.buttonSaveTextElement).disabled = (this.text == '');
};

ManageTextElement.prototype.isOnArea = function(x, y) {
    var enterInContent = this.text.split('\n');

    var xWidth = 0;

    if(this.properties.align == 'center')
    {
        xWidth = (this.widthLine / 2);
    }
    else if(this.properties.align == 'right')
    {
        xWidth = this.widthLine;
    }

    return x >= ((this.properties.pos.x - xWidth) - 5) && y >= (this.properties.pos.y - this.properties.size) && x <= ((this.properties.pos.x - xWidth) + this.widthLine + 5) && y <= ((this.properties.pos.y - this.properties.size) + (enterInContent.length * this.properties.size) + 15);
};

ManageTextElement.prototype.mouseDown = function(e) {
    if(e.button == 0)
    {
        currentManageTextElement.leftClick = true;

        var xMouse = e.clientX + window.scrollX - $('#' + currentManageTextElement.canvasId).offset().left;
        var yMouse = e.clientY + window.scrollY - $('#' + currentManageTextElement.canvasId).offset().top;

        currentManageTextElement.isSelected = currentManageTextElement.isOnArea(xMouse, yMouse);

        currentManageTextElement.writeTextToCanvas();
    }
};

ManageTextElement.prototype.mouseUp = function(e) {
    if(e.button == 0)
    {
        currentManageTextElement.leftClick = false;

        document.getElementById(currentManageTextElement.elementsId.textArea).focus();
        document.getElementById(currentManageTextElement.elementsId.textArea).setSelectionRange(currentManageTextElement.text.length, currentManageTextElement.text.length);
    }
};

ManageTextElement.prototype.mouseMove = function(e) {
    if(currentManageTextElement.isSelected && currentManageTextElement.leftClick)
    {
        currentManageTextElement.properties.pos.x = e.clientX + window.scrollX - $('#' + currentManageTextElement.canvasId).offset().left;
        currentManageTextElement.properties.pos.y = e.clientY + window.scrollY - $('#' + currentManageTextElement.canvasId).offset().top;
    }

    currentManageTextElement.writeTextToCanvas();
};