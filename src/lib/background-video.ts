/**
 * Video de fondo (hero): iOS solo autoplayea si está muted + playsinline.
 * Low Power Mode sigue bloqueando play(); en ese caso hay que ocultar el <video>.
 */
export function prepareBackgroundVideo(video: HTMLVideoElement) {
  video.controls = false;
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback");
  video.disablePictureInPicture = true;
  if ("disableRemotePlayback" in video) {
    video.disableRemotePlayback = true;
  }
}

export async function playBackgroundVideo(
  video: HTMLVideoElement,
): Promise<boolean> {
  prepareBackgroundVideo(video);
  try {
    await video.play();
    return !video.paused;
  } catch {
    return false;
  }
}
