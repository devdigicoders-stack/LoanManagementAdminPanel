import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckSquare, Square, ExternalLink, Loader2 } from 'lucide-react';

const AddressSection = ({
  currentAddress = {},
  permanentAddress = {},
  isPermanentSame = false,
  onChange,
  disabled = false,
  themeColor = '#0F5A3B', // Brand emerald green
}) => {
  const [isSame, setIsSame] = useState(isPermanentSame || false);
  const [loadingPincodeCurrent, setLoadingPincodeCurrent] = useState(false);
  const [loadingPincodePermanent, setLoadingPincodePermanent] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Local state initialized from props
  const [curr, setCurr] = useState({
    houseNo: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
    formattedAddress: '',
    ...currentAddress
  });

  const [perm, setPerm] = useState({
    houseNo: '',
    street: '',
    landmark: '',
    area: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
    formattedAddress: '',
    ...permanentAddress
  });

  useEffect(() => {
    if (currentAddress && Object.keys(currentAddress).length > 0) {
      setCurr(prev => ({ ...prev, ...currentAddress }));
    }
  }, [currentAddress]);

  useEffect(() => {
    if (permanentAddress && Object.keys(permanentAddress).length > 0) {
      setPerm(prev => ({ ...prev, ...permanentAddress }));
    }
  }, [permanentAddress]);

  // Sync to parent when state changes
  const notifyParent = (updatedCurr, updatedPerm, sameFlag) => {
    if (onChange) {
      onChange({
        currentAddress: updatedCurr,
        permanentAddress: sameFlag ? updatedCurr : updatedPerm,
        isPermanentSameAsCurrent: sameFlag
      });
    }
  };

  const handleCurrChange = (field, value) => {
    const updated = { ...curr, [field]: value };
    setCurr(updated);

    if (field === 'pincode' && value.trim().length === 6) {
      fetchPincodeData(value.trim(), 'current');
    }

    if (isSame) {
      setPerm(updated);
      notifyParent(updated, updated, true);
    } else {
      notifyParent(updated, perm, false);
    }
  };

  const handlePermChange = (field, value) => {
    if (isSame) return;
    const updated = { ...perm, [field]: value };
    setPerm(updated);

    if (field === 'pincode' && value.trim().length === 6) {
      fetchPincodeData(value.trim(), 'permanent');
    }

    notifyParent(curr, updated, false);
  };

  const handleSameToggle = () => {
    const nextSame = !isSame;
    setIsSame(nextSame);
    if (nextSame) {
      setPerm({ ...curr });
      notifyParent(curr, curr, true);
    } else {
      notifyParent(curr, perm, false);
    }
  };

  // Pincode auto-fetch
  const fetchPincodeData = async (pin, target = 'current') => {
    if (target === 'current') setLoadingPincodeCurrent(true);
    else setLoadingPincodePermanent(true);

    try {
      // First try local backend API, fallback to India Post API
      let data = null;
      try {
        const res = await fetch(`http://localhost:5000/api/location/pincode/${pin}`);
        if (res.ok) data = await res.json();
      } catch (e) {}

      if (!data || !data.success) {
        const postRes = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const postData = await postRes.json();
        if (Array.isArray(postData) && postData[0]?.Status === 'Success') {
          const po = postData[0].PostOffice[0] || {};
          data = {
            success: true,
            city: po.District || po.Division || '',
            district: po.District || '',
            state: po.State || '',
            areas: postData[0].PostOffice.map(p => p.Name).filter(Boolean)
          };
        }
      }

      if (data && data.success) {
        if (target === 'current') {
          const updated = {
            ...curr,
            city: data.city || curr.city,
            district: data.district || curr.district,
            state: data.state || curr.state,
            area: (data.areas && data.areas[0]) ? data.areas[0] : curr.area
          };
          setCurr(updated);
          if (isSame) {
            setPerm(updated);
            notifyParent(updated, updated, true);
          } else {
            notifyParent(updated, perm, false);
          }
        } else {
          const updated = {
            ...perm,
            city: data.city || perm.city,
            district: data.district || perm.district,
            state: data.state || perm.state,
            area: (data.areas && data.areas[0]) ? data.areas[0] : perm.area
          };
          setPerm(updated);
          notifyParent(curr, updated, false);
        }
      }
    } catch (err) {
      console.error('Error fetching pincode:', err);
    } finally {
      if (target === 'current') setLoadingPincodeCurrent(false);
      else setLoadingPincodePermanent(false);
    }
  };

  // Use Current Location via Browser GPS
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }

    setLoadingGPS(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode via backend or openstreetmap
          let resData = null;
          try {
            const resp = await fetch('http://localhost:5000/api/location/reverse-geocode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ latitude, longitude })
            });
            if (resp.ok) resData = await resp.json();
          } catch (e) {}

          if (!resData) {
            const nomResp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const parsed = await nomResp.json();
            const addr = parsed.address || {};
            resData = {
              success: true,
              formattedAddress: parsed.display_name,
              houseNo: addr.house_number || '',
              street: addr.road || addr.suburb || '',
              landmark: addr.neighbourhood || '',
              area: addr.suburb || addr.neighbourhood || '',
              city: addr.city || addr.town || addr.county || '',
              district: addr.state_district || addr.district || '',
              state: addr.state || '',
              pincode: addr.postcode || '',
            };
          }

          const updated = {
            ...curr,
            latitude,
            longitude,
            formattedAddress: resData.formattedAddress || `Lat: ${latitude}, Lng: ${longitude}`,
            houseNo: resData.houseNo || curr.houseNo,
            street: resData.street || curr.street,
            landmark: resData.landmark || curr.landmark,
            area: resData.area || curr.area,
            city: resData.city || curr.city,
            district: resData.district || curr.district,
            state: resData.state || curr.state,
            pincode: resData.pincode || curr.pincode,
          };

          setCurr(updated);
          if (isSame) {
            setPerm(updated);
            notifyParent(updated, updated, true);
          } else {
            notifyParent(updated, perm, false);
          }
        } catch (err) {
          setGpsError('Failed to resolve address from coordinates');
        } finally {
          setLoadingGPS(false);
        }
      },
      (error) => {
        setLoadingGPS(false);
        setGpsError(error.message || 'Permission to access location was denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getGoogleMapsUrl = (lat, lng, queryAddress) => {
    if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryAddress || 'India')}`;
  };

  return (
    <div className="space-y-6 my-4">
      {/* 1. CURRENT ADDRESS BLOCK */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Current Address</h4>
              <p className="text-[11px] text-slate-500">Present residential / operational location</p>
            </div>
          </div>

          {/* Use Current GPS Location Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loadingGPS || disabled}
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm disabled:opacity-50"
            >
              {loadingGPS ? <Loader2 size={13} className="animate-spin" /> : <Navigation size={13} />}
              <span>{loadingGPS ? 'Fetching GPS...' : 'Use Current Location'}</span>
            </button>

            {curr.latitude && curr.longitude && (
              <a
                href={getGoogleMapsUrl(curr.latitude, curr.longitude, `${curr.street} ${curr.city} ${curr.pincode}`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                <ExternalLink size={12} />
                <span>Map View</span>
              </a>
            )}
          </div>
        </div>

        {gpsError && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {gpsError}
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">House / Flat / Building No.</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.houseNo || ''}
              onChange={e => handleCurrChange('houseNo', e.target.value)}
              placeholder="e.g. Flat 402, Shivam Apts"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street / Road Address</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.street || ''}
              onChange={e => handleCurrChange('street', e.target.value)}
              placeholder="e.g. MG Road, Near Metro Pillar"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.landmark || ''}
              onChange={e => handleCurrChange('landmark', e.target.value)}
              placeholder="e.g. Near City Hospital"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Locality</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.area || ''}
              onChange={e => handleCurrChange('area', e.target.value)}
              placeholder="e.g. Hazratganj / Indiranagar"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Pincode (6 Digits) *</label>
              {loadingPincodeCurrent && (
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> Auto-fetching...
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={6}
              disabled={disabled}
              value={curr.pincode || ''}
              onChange={e => handleCurrChange('pincode', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 226001"
              className="w-full px-3 py-2 text-xs font-bold tracking-wider border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / District *</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.city || curr.district || ''}
              onChange={e => {
                handleCurrChange('city', e.target.value);
                handleCurrChange('district', e.target.value);
              }}
              placeholder="e.g. Lucknow"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
            <input
              type="text"
              disabled={disabled}
              value={curr.state || ''}
              onChange={e => handleCurrChange('state', e.target.value)}
              placeholder="e.g. Uttar Pradesh"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/50"
            />
          </div>
        </div>
      </div>

      {/* 2. SAME AS CURRENT CHECKBOX */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
        <label
          onClick={handleSameToggle}
          className="flex items-center gap-3 cursor-pointer select-none text-xs font-bold text-slate-800"
        >
          {isSame ? (
            <CheckSquare size={18} className="text-emerald-600 flex-shrink-0" />
          ) : (
            <Square size={18} className="text-slate-400 flex-shrink-0" />
          )}
          <span>Permanent Address is same as Current Address</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium">Auto-syncs fields</span>
      </div>

      {/* 3. PERMANENT ADDRESS BLOCK */}
      <div className={`bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-opacity ${isSame ? 'opacity-65' : ''}`}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <MapPin size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Permanent Address</h4>
              <p className="text-[11px] text-slate-500">Official / native place address as on documents</p>
            </div>
          </div>
          {isSame && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800">
              Same as Current
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">House / Flat / Building No.</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.houseNo || ''}
              onChange={e => handlePermChange('houseNo', e.target.value)}
              placeholder="e.g. Village / House No."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street / Road Address</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.street || ''}
              onChange={e => handlePermChange('street', e.target.value)}
              placeholder="e.g. Post Office Road"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.landmark || ''}
              onChange={e => handlePermChange('landmark', e.target.value)}
              placeholder="e.g. Near Panchayat Bhawan"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Village</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.area || ''}
              onChange={e => handlePermChange('area', e.target.value)}
              placeholder="e.g. Tahsil / Area"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Pincode (6 Digits) *</label>
              {loadingPincodePermanent && (
                <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> Auto-fetching...
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={6}
              disabled={disabled || isSame}
              value={perm.pincode || ''}
              onChange={e => handlePermChange('pincode', e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 226001"
              className="w-full px-3 py-2 text-xs font-bold tracking-wider border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / District *</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.city || perm.district || ''}
              onChange={e => {
                handlePermChange('city', e.target.value);
                handlePermChange('district', e.target.value);
              }}
              placeholder="e.g. Lucknow"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
            <input
              type="text"
              disabled={disabled || isSame}
              value={perm.state || ''}
              onChange={e => handlePermChange('state', e.target.value)}
              placeholder="e.g. Uttar Pradesh"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 disabled:bg-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
