export const procedureXslt = '\
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\
  <xsl:output method="html"/>\
  \
  <xsl:template match="/dmodule/content">\
    <div class="content">\
      <xsl:apply-templates select="procedure" />\
    </div>\
  </xsl:template>\
  \
  <xsl:template match="procedure">\
    <div class="procedure">\
      <xsl:apply-templates select="mainProcedure" />\
    </div>\
  </xsl:template>\
  \
  <xsl:template match="mainProcedure">\
    <div class="mainProcedure">\
      <xsl:apply-templates select="proceduralStep" />\
    </div>\
  </xsl:template>\
  \
  <xsl:template match="proceduralStep">\
    <div class="proceduralStep">\
      <xsl:apply-templates select="para" />\
    </div>\
  </xsl:template>\
  \
  <xsl:template match="para">\
    <p class="para">\
      <xsl:value-of select="text()" />\
    </p>\
  </xsl:template>\
</xsl:stylesheet>'