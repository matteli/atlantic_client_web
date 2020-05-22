export const procedureXslt = '\
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\
  <xsl:output method="html"/>\
  <xsl:template match="/">\
    <div>\
      <xsl:for-each select="dmodule/content">\
        <div class="content">\
          <xsl:for-each select="procedure">\
            <div class="procedure">\
              <xsl:for-each select="mainProcedure">\
                <div class="mainProcedure">\
                  <xsl:for-each select="proceduralStep">\
                    <div class="proceduralStep">\
                      <xsl:for-each select="para">\
                        <xsl:element name="p">\
                          <xsl:attribute name="class">para</xsl:attribute>\
                          <xsl:value-of select="text()"/>\
                        </xsl:element>\
                      </xsl:for-each>\
                    </div>\
                  </xsl:for-each>\
                </div>\
              </xsl:for-each>\
            </div>\
          </xsl:for-each>\
        </div>\
      </xsl:for-each>\
    </div>\
  </xsl:template>\
</xsl:stylesheet>'
