function DamageIndicator(damage){
    this.time = 1;
    this.damage = damage;
}
const indicatorBlock = extendContent(Wall, "indicator-wall", {
    update(tile){
        this.super$update(tile);
        var entity = tile.ent();
        entity.setLabels(entity.getLabels().filter((lable, index)=>lable.time>0));
        entity.getLabels().forEach((lable, index)=>{
            lable.time = Mathf.lerpDelta(lable.time, 0, 0.80);
        });
        var delay = entity.getDelay();
        delay+=entity.delta();
        entity.setDelay(delay);
        if (delay>=10) {
            var total = 0;
            entity.setDelay(0);
            entity.getLabels().forEach(label=>total+=label.damage);
            entity.getLabels().forEach((lable, index)=>{
                Vars.ui.showLabel(lable.damage, 0.5, tile.drawx(), tile.drawy()+8+(8*index));
            });
            Vars.ui.showLabel(total, 0.5, tile.drawx(), tile.drawy()-8);
        }
    }
});
indicatorBlock.entityType = prov(()=>extend(TileEntity, {
    _labels: [],
    getLabels() {
        return this._labels;
    },
    setLabels(value) {
        this._labels = value;
    },
    _delay: 0,
    getDelay() {
        return this._delay;
    },
    setDelay(value) {
        this._delay = value;
    },
    damage(damage){
        this.getLabels().push(new DamageIndicator(damage));
    }
}));
indicatorBlock.health = 1;
indicatorBlock.buildVisibility = BuildVisibility.sandboxOnly;
indicatorBlock.requirements = [new ItemStack(Items.copper, 1)];
indicatorBlock.size = 2;
indicatorBlock.update = true;
print("Testing loaded successfully");