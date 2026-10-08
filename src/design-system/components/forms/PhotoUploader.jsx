import React from "react";
import { Icon } from "../core/Icon";
import { IconButton } from "../core/IconButton";
import { Badge } from "../core/Badge";
const cx = (...a) => a.filter(Boolean).join(" ");
export function PhotoUploader({ label = "Photos", addLabel = "Add photos", hint = "The first photo is your cover", coverLabel = "Cover", photos = [], onAdd, onRemove, className = "" }) {
  const handle = (e) => { const files = Array.from(e.target.files ?? []); e.target.value = ""; if (onAdd) onAdd(files); };
  return (
    <div className={cx("sw-uploader", className)}>
      <span className="sw-uploader__label">{label}</span>
      {photos.length > 0 && (
        <div className="sw-uploader__grid">
          {photos.map((src, i) => (
            <div key={i} className="sw-uploader__thumb">
              <img src={src} alt="" />
              {i === 0 && <span className="sw-uploader__cover"><Badge variant="light">{coverLabel}</Badge></span>}
              <span className="sw-uploader__remove"><IconButton icon="x-lg" variant="onimage" size="sm" label="Remove photo" onClick={() => onRemove && onRemove(i)} /></span>
            </div>
          ))}
        </div>
      )}
      <label className="sw-uploader__drop">
        <Icon name="images" />
        <strong>{addLabel}</strong>
        <span>{hint}</span>
        <input type="file" accept="image/*" multiple onChange={handle} style={{ display: "none" }} />
      </label>
    </div>
  );
}
