function Label(){
    this.time = 1;
}
const indicatorBlock = extendContent(Wall, "indicator-wall", {});
indicatorBlock.entityType = prov(()=>extend(TileEntity, {
    _labels: [],
    getLabels() {
        return this._labels;
    },
    setLabels(value) {
        this._labels = value;
    },
    damage(damage){
        this.setLabels(this.getLabels().filter((lable, index)=>lable.time>0));
        this.getLabels().forEach(lable=>{lable.time = Mathf.lerpDelta(lable.time, 0, 1);});
        Vars.ui.showLabel(damage, 1, this.tile.drawx(), this.tile.drawy()+8+(8*this.getLabels().length));
        this.getLabels().push(new Label());
    }
}));
indicatorBlock.health = 1;
indicatorBlock.buildVisibility = BuildVisibility.sandboxOnly;
indicatorBlock.requirements = [new ItemStack(Items.copper, 1)];
indicatorBlock.size = 2;
print("Testing loaded successfully");