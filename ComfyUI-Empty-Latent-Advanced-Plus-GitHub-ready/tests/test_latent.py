import importlib.util
from unittest.mock import patch
from pathlib import Path
source = Path(__file__).resolve().parents[1] / 'nodes.py'
spec=importlib.util.spec_from_file_location('nodes',source)
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
klass=m.EmptyLatentAdvancedSelector
inst=klass()
assert len(klass.RESOLUTIONS)==67
assert len(set(klass.RESOLUTIONS))==67
for latent, (channels,downscale) in klass.LATENT_TYPES.items():
    for name, (w,h) in klass.RESOLUTIONS.items():
        recorded=[]
        def fake_zeros(shape, **kwargs):
            recorded.append(tuple(shape))
            return shape
        with patch.object(m.torch, 'zeros', fake_zeros):
            result=inst.generate(name,'Use Preset',832,1216,**{'Latent Type':latent, 'Batch Size':2})
        _,out_w,out_h=result
        assert recorded==[(2,channels,out_h//downscale,out_w//downscale)],name
        assert out_w%downscale==0 and out_h%downscale==0, name
        assert abs(w-out_w)<16 and abs(h-out_h)<16, name
        assert out_w>=64 and out_h>=64
# Check direct in override, including locked ratio and big/small values
with patch.object(m.torch, 'zeros', lambda shape, **kwargs: shape):
    preset='▯ 720×1080 (HD - 2:3)'
    _,w,h=inst.generate(preset, 'Override', 1640, 2000,**{'Ratio Lock':False,'Latent Type':'Flux 2 / Klein (128ch)'})
    assert (w,h)==(1648,2000)
    samples,w,h=inst.generate(preset, 'Override', 1640, 2000,**{'Ratio Lock':True,'Latent Type':'Flux 2 / Klein (128ch)'})
    assert (w,h)==(1648,2464), (w,h)
assert list(klass.INPUT_TYPES()['required']) == ['Resolution','Mode','Ratio Lock','Width','Height','Batch Size','Latent Type','Filter']
print('PASS: 67 presets x 3 latent formats; output shape, strides, override, legacy widget ordering')
