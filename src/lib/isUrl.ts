const pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

export function isURL(url: string) {
  return pattern.test(url) || 'Please enter a valid URL.';
}
