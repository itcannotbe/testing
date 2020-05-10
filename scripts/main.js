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
indicatorBlock.size = 1;
indicatorBlock.update = true;
//quezler's throughput ported to 5.0
const throughputVoid = extendContent(ItemVoid, "throughput-void", {
    setBars() {
        this.super$setBars();
        this.bars.add("throughput", func(entity => new Bar(
            prov(()=>"Throughput: " + Strings.fixed(entity.throughput().getMean() * (60 / Time.delta()), 2) + "/s"),
            prov(() => Pal.items),
            floatp(() => 1)
        )));
    },
    handleItem(item, tile, source) {
        tile.entity.iIncrement();
    }
});
throughputVoid.entityType = prov(ent => extend(TileEntity, {
    _i: 0,
    _window: new WindowedMean(60*10),
    iIncrement() {
        this._i++;
    },
    throughput() {
        return this._window;
    },
    update() {
        this.super$update();
        this._window.addValue(this._i);
        this._i = 0;
    }
}));
const liquidThroughputVoid = extendContent(LiquidVoid, "liquid-throughput-void", {
    setBars() {
        this.super$setBars();
        this.bars.add("throughput", func(entity => new Bar(
            prov(()=>"Throughput: " + Strings.fixed(entity.throughput().getMean() * (60 / Time.delta()), 2) + "/s"),
            prov(() => Pal.items),
            floatp(() => 1)
        )));
    },
    handleLiquid(tile, source, liquid, amount) {
        tile.entity.iIncrement(amount);
    }
});
liquidThroughputVoid.entityType = prov(ent => extend(TileEntity, {
    _i: 0,
    _window: new WindowedMean(60*10),
    iIncrement(value) {
        this._i+=value;
    },
    throughput() {
        return this._window;
    },
    update() {
        this.super$update();
        this._window.addValue(this._i);
        this._i = 0;
    }
}));

liquidThroughputVoid.health = 1;
liquidThroughputVoid.buildVisibility = BuildVisibility.sandboxOnly;
liquidThroughputVoid.requirements = [new ItemStack(Items.copper, 1)];
liquidThroughputVoid.size = 1;
liquidThroughputVoid.update = true;

throughputVoid.health = 1;
throughputVoid.buildVisibility = BuildVisibility.sandboxOnly;
throughputVoid.requirements = [new ItemStack(Items.copper, 1)];
throughputVoid.size = 1;
throughputVoid.update = true;

print("Testing loaded successfully");