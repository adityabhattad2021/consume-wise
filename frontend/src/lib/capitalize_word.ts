export const capitalizeWords = (str: string) => 
    str
      .toLowerCase()
      .replace(/_/g, ' ') 
      .replace(/\b\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  
  