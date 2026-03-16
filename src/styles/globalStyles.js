import { StyleSheet } from 'react-native';
import theme from './theme';

const globalStyles = StyleSheet.create({

  // ─── Layout ───────────────────────────────────────────────────────────────────
  flex1:           { flex: 1 },
  flexRow:         { flexDirection: 'row' },
  flexRowCenter:   { flexDirection: 'row', alignItems: 'center' },
  flexRowBetween:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flexRowWrap:     { flexDirection: 'row', flexWrap: 'wrap' },
  center:          { justifyContent: 'center', alignItems: 'center' },
  centerHoriz:     { alignItems: 'center' },
  centerVert:      { justifyContent: 'center' },
  safeArea:        { flex: 1, backgroundColor: theme.colors.background },
  fill:            { flex: 1, width: '100%' },
  selfStart:       { alignSelf: 'flex-start' },
  selfEnd:         { alignSelf: 'flex-end' },
  selfCenter:      { alignSelf: 'center' },
  selfStretch:     { alignSelf: 'stretch' },

  // ─── Overflow ─────────────────────────────────────────────────────────────────
  overflowHidden:  { overflow: 'hidden' },

  // ─── Padding ──────────────────────────────────────────────────────────────────
  pXS:     { padding: theme.spacing.xs },
  pSM:     { padding: theme.spacing.sm },
  pMD:     { padding: theme.spacing.md },
  pLG:     { padding: theme.spacing.lg },
  pXL:     { padding: theme.spacing.xl },

  phXS:    { paddingHorizontal: theme.spacing.xs },
  phSM:    { paddingHorizontal: theme.spacing.sm },
  phMD:    { paddingHorizontal: theme.spacing.md },
  phLG:    { paddingHorizontal: theme.spacing.lg },
  phXL:    { paddingHorizontal: theme.spacing.xl },

  pvXS:    { paddingVertical: theme.spacing.xs },
  pvSM:    { paddingVertical: theme.spacing.sm },
  pvMD:    { paddingVertical: theme.spacing.md },
  pvLG:    { paddingVertical: theme.spacing.lg },
  pvXL:    { paddingVertical: theme.spacing.xl },

  ptSM:    { paddingTop: theme.spacing.sm },
  ptMD:    { paddingTop: theme.spacing.md },
  ptLG:    { paddingTop: theme.spacing.lg },
  pbSM:    { paddingBottom: theme.spacing.sm },
  pbMD:    { paddingBottom: theme.spacing.md },
  pbLG:    { paddingBottom: theme.spacing.lg },

  // ─── Margin ───────────────────────────────────────────────────────────────────
  mXS:     { margin: theme.spacing.xs },
  mSM:     { margin: theme.spacing.sm },
  mMD:     { margin: theme.spacing.md },
  mLG:     { margin: theme.spacing.lg },

  mhMD:    { marginHorizontal: theme.spacing.md },
  mhLG:    { marginHorizontal: theme.spacing.lg },
  mvSM:    { marginVertical: theme.spacing.sm },
  mvMD:    { marginVertical: theme.spacing.md },

  mtXS:    { marginTop: theme.spacing.xs },
  mtSM:    { marginTop: theme.spacing.sm },
  mtMD:    { marginTop: theme.spacing.md },
  mtLG:    { marginTop: theme.spacing.lg },
  mtXL:    { marginTop: theme.spacing.xl },

  mbXS:    { marginBottom: theme.spacing.xs },
  mbSM:    { marginBottom: theme.spacing.sm },
  mbMD:    { marginBottom: theme.spacing.md },
  mbLG:    { marginBottom: theme.spacing.lg },
  mbXL:    { marginBottom: theme.spacing.xl },

  mrXS:    { marginRight: theme.spacing.xs },
  mrSM:    { marginRight: theme.spacing.sm },
  mrMD:    { marginRight: theme.spacing.md },

  mlXS:    { marginLeft: theme.spacing.xs },
  mlSM:    { marginLeft: theme.spacing.sm },
  mlMD:    { marginLeft: theme.spacing.md },

  // ─── Cards ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: theme.colors.card,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.md,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.07,
    shadowRadius:    10,
    elevation:       3,
  },
  cardFlat: {
    backgroundColor: theme.colors.card,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.md,
  },
  cardOutlined: {
    backgroundColor: theme.colors.card,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.md,
    borderWidth:     1.5,
    borderColor:     theme.colors.border,
  },
  cardElevated: {
    backgroundColor: theme.colors.card,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.md,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 6 },
    shadowOpacity:   0.12,
    shadowRadius:    16,
    elevation:       6,
  },

  // ─── Typography ───────────────────────────────────────────────────────────────
  h1:       theme.typography.h1,
  h2:       theme.typography.h2,
  h3:       theme.typography.h3,
  h4:       theme.typography.h4,
  h5:       theme.typography.h5,
  body1:    theme.typography.body1,
  body2:    theme.typography.body2,
  caption:  theme.typography.caption,
  label:    theme.typography.label,
  overline: theme.typography.overline,

  textCenter:   { textAlign: 'center' },
  textRight:    { textAlign: 'right' },
  textLeft:     { textAlign: 'left' },
  textBold:     { fontWeight: '700' },
  textSemiBold: { fontWeight: '600' },
  textNormal:   { fontWeight: '400' },
  textItalic:   { fontStyle: 'italic' },
  textUnderline:{ textDecorationLine: 'underline' },
  textUppercase:{ textTransform: 'uppercase' },
  textCapitalize:{ textTransform: 'capitalize' },

  textPrimary:  { color: theme.colors.text },
  textSecondary:{ color: theme.colors.textSecondary },
  textMuted:    { color: theme.colors.textTertiary },
  textLink:     { color: theme.colors.link, fontWeight: '600' },
  textError:    { color: theme.colors.error, fontSize: 12, marginTop: 4 },
  textSuccess:  { color: '#15803D' },
  textWarning:  { color: '#C2410C' },
  textDanger:   { color: '#BE123C' },
  textWhite:    { color: '#FFFFFF' },

  // ─── Input ────────────────────────────────────────────────────────────────────
  inputBase: {
    backgroundColor:  theme.colors.input,
    borderWidth:      1.5,
    borderColor:      theme.colors.border,
    borderRadius:     theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height:           50,
    fontSize:         14,
    color:            theme.colors.text,
  },
  inputFocused: {
    borderColor:     theme.colors.borderFocus,
    backgroundColor: theme.colors.surface,
  },
  inputError: {
    borderColor: theme.colors.borderError,
  },
  inputLabel: {
    fontSize:    13,
    fontWeight:  '600',
    color:       theme.colors.textSecondary,
    marginBottom: 6,
  },
  inputHint: {
    fontSize:  11,
    color:     theme.colors.textTertiary,
    marginTop: 4,
  },
  inputErrorText: {
    fontSize:  12,
    color:     theme.colors.error,
    marginTop: 4,
  },

  // ─── Buttons ──────────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius:    theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems:      'center',
    justifyContent:  'center',
    shadowColor:     theme.colors.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    10,
    elevation:       6,
  },
  btnSecondary: {
    backgroundColor: theme.colors.surface,
    borderRadius:    theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1.5,
    borderColor:     theme.colors.primary,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderRadius:    theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1.5,
    borderColor:     theme.colors.border,
  },
  btnDanger: {
    backgroundColor: '#BE123C',
    borderRadius:    theme.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems:      'center',
    justifyContent:  'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnTextPrimary:   { color: '#FFFFFF',           fontSize: 15, fontWeight: '700' },
  btnTextSecondary: { color: theme.colors.primary, fontSize: 15, fontWeight: '700' },
  btnTextOutline:   { color: theme.colors.text,    fontSize: 15, fontWeight: '600' },
  btnTextDanger:    { color: '#FFFFFF',            fontSize: 15, fontWeight: '700' },

  // ─── Divider ──────────────────────────────────────────────────────────────────
  divider: {
    height:          1,
    backgroundColor: theme.colors.borderLight,
    marginVertical:  theme.spacing.sm,
  },
  dividerLG: {
    height:          1,
    backgroundColor: theme.colors.borderLight,
    marginVertical:  theme.spacing.md,
  },

  // ─── Section header ───────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   theme.spacing.sm,
  },
  sectionTitle: {
    fontSize:   16,
    fontWeight: '700',
    color:      theme.colors.text,
  },
  sectionAction: {
    fontSize:   13,
    fontWeight: '600',
    color:      theme.colors.link,
  },
  sectionLabelOverline: {
    fontSize:      11,
    fontWeight:    '700',
    color:         theme.colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom:  8,
  },

  // ─── Badge ────────────────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
    alignSelf:         'flex-start',
  },
  badgeText: {
    fontSize:   11,
    fontWeight: '600',
  },

  // ─── Avatar ───────────────────────────────────────────────────────────────────
  avatarSM: {
    width:           32,  height: 32,
    borderRadius:    16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent:  'center',
    alignItems:      'center',
  },
  avatarMD: {
    width:           44,  height: 44,
    borderRadius:    22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent:  'center',
    alignItems:      'center',
  },
  avatarLG: {
    width:           60,  height: 60,
    borderRadius:    30,
    backgroundColor: theme.colors.primaryLight,
    justifyContent:  'center',
    alignItems:      'center',
  },
  avatarXL: {
    width:           90,  height: 90,
    borderRadius:    45,
    backgroundColor: theme.colors.primaryLight,
    justifyContent:  'center',
    alignItems:      'center',
  },

  // ─── Empty state ──────────────────────────────────────────────────────────────
  emptyContainer: {
    flex:              1,
    justifyContent:    'center',
    alignItems:        'center',
    paddingVertical:   60,
    paddingHorizontal: 40,
  },
  emptyIcon:     { fontSize: 48, marginBottom: 12 },
  emptyTitle:    { fontSize: 17, fontWeight: '700', color: theme.colors.text,          marginBottom: 6,  textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: theme.colors.textTertiary, textAlign: 'center', lineHeight: 20 },

  // ─── Loading ──────────────────────────────────────────────────────────────────
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent:  'center',
    alignItems:      'center',
    zIndex:          999,
  },

  // ─── List item ────────────────────────────────────────────────────────────────
  listItem: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: theme.colors.card,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing.md,
    marginBottom:    theme.spacing.sm,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.04,
    shadowRadius:    4,
    elevation:       1,
  },

  // ─── Screen ───────────────────────────────────────────────────────────────────
  screenContainer: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },
  screenContent: {
    flex:              1,
    paddingHorizontal: theme.spacing.md,
  },
  screenScroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom:     40,
  },

  // ─── Shadows ──────────────────────────────────────────────────────────────────
  shadowSM: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius:  4,
    elevation:     1,
  },
  shadowMD: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius:  10,
    elevation:     3,
  },
  shadowLG: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation:     6,
  },

  // ─── Border radius helpers ────────────────────────────────────────────────────
  roundedSM:   { borderRadius: theme.radius.sm  },
  roundedMD:   { borderRadius: theme.radius.md  },
  roundedLG:   { borderRadius: theme.radius.lg  },
  roundedXL:   { borderRadius: theme.radius.xl  },
  roundedFull: { borderRadius: theme.radius.full },

  // ─── Background helpers ───────────────────────────────────────────────────────
  bgWhite:     { backgroundColor: '#FFFFFF'                 },
  bgScreen:    { backgroundColor: theme.colors.background   },
  bgSurface:   { backgroundColor: theme.colors.surface      },
  bgPrimary:   { backgroundColor: theme.colors.primary      },
  bgLight:     { backgroundColor: theme.colors.primaryLight },
  bgSuccess:   { backgroundColor: '#F0FDF4'                 },
  bgWarning:   { backgroundColor: '#FFF7ED'                 },
  bgDanger:    { backgroundColor: '#FFF1F2'                 },
  bgInfo:      { backgroundColor: '#EFF6FF'                 },
});

export default globalStyles;